import { prisma, withDbFallback } from "@/lib/db";
import { postCover } from "@/lib/images";
import { readingMinutes } from "@/lib/utils";
import type { Post as DbPost } from "@/generated/prisma";

// Every read here is wrapped in `withDbFallback` because these queries also run
// during `next build` (prerendering, sitemap, feed, generateStaticParams). With
// a database present nothing changes; without one the build still completes and
// the content arrives at runtime. See src/lib/db.ts.

// ─── View models the public components consume ───────────────────

export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  publishedAt: string; // ISO
  updatedAt: string; // ISO — real edit time, for dateModified / sitemap
  readingMinutes: number;
  wordCount: number;
  content: string; // HTML
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PublicTestimonial = {
  name: string;
  role: string | null;
  quote: string;
};

export type PublicFaqGroup = {
  category: string;
  items: { question: string; answer: string }[];
};

/** Just what the sitemap needs — cheap projection, no content column. */
export type PostSitemapEntry = {
  slug: string;
  updatedAt: Date;
  coverImage: string;
  title: string;
};

function wordsIn(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function toPublicPost(post: DbPost): PublicPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category ?? "Journal",
    coverImage: post.coverImage || postCover(post.slug),
    coverAlt: `Cover image for “${post.title}”`,
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    readingMinutes: readingMinutes(post.content),
    wordCount: wordsIn(post.content),
    content: post.content,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  };
}

const PUBLISHED = { status: "PUBLISHED" as const };

// ─── Posts ───────────────────────────────────────────────────────

export const BLOG_PAGE_SIZE = 9;

export async function getPublishedPosts({
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
}: { page?: number; pageSize?: number } = {}) {
  return withDbFallback(
    async () => {
      const [total, posts] = await Promise.all([
        prisma.post.count({ where: PUBLISHED }),
        prisma.post.findMany({
          where: PUBLISHED,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);
      return {
        posts: posts.map(toPublicPost),
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        page,
      };
    },
    { posts: [] as PublicPost[], total: 0, totalPages: 1, page },
  );
}

export async function getLatestPosts(take = 3): Promise<PublicPost[]> {
  return withDbFallback(async () => {
    const posts = await prisma.post.findMany({
      where: PUBLISHED,
      orderBy: { publishedAt: "desc" },
      take,
    });
    return posts.map(toPublicPost);
  }, []);
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PublicPost | null> {
  return withDbFallback(async () => {
    const post = await prisma.post.findFirst({ where: { slug, ...PUBLISHED } });
    return post ? toPublicPost(post) : null;
  }, null);
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  return withDbFallback(async () => {
    const posts = await prisma.post.findMany({
      where: PUBLISHED,
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  }, []);
}

/** Slug + real edit time + cover, for `sitemap.ts` image entries. */
export async function getPostSitemapEntries(): Promise<PostSitemapEntry[]> {
  return withDbFallback(async () => {
    const posts = await prisma.post.findMany({
      where: PUBLISHED,
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, updatedAt: true, coverImage: true },
    });
    return posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      updatedAt: p.updatedAt,
      coverImage: p.coverImage || postCover(p.slug),
    }));
  }, []);
}

// ─── FAQs ────────────────────────────────────────────────────────

export async function getPublishedFaqGroups(): Promise<PublicFaqGroup[]> {
  return withDbFallback(async () => {
    const faqs = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    const groups: PublicFaqGroup[] = [];
    for (const faq of faqs) {
      const category = faq.category ?? "General";
      let group = groups.find((g) => g.category === category);
      if (!group) {
        group = { category, items: [] };
        groups.push(group);
      }
      group.items.push({ question: faq.question, answer: faq.answer });
    }
    return groups;
  }, []);
}

// ─── Testimonials ────────────────────────────────────────────────

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  return withDbFallback(async () => {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return testimonials.map((t) => ({
      name: t.name,
      role: t.role,
      quote: t.quote,
    }));
  }, []);
}
