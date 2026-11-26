import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedPostBySlug,
  getAllPublishedSlugs,
  getPublishedPosts,
} from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { PostCard } from "@/components/ui/PostCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { PostNextSteps } from "@/components/sections/InternalLinks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPostingJsonLd } from "@/lib/structured-data";
import {
  glossaryMentionedIn,
  rankRelatedPosts,
  servicesForPost,
} from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Safety net for a build that ran without a database: generateStaticParams
// returns [] there, so posts render on demand instead — see src/lib/db.ts.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    images: [{ url: post.coverImage, alt: post.coverAlt }],
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      authors: [site.practitioner?.name ?? site.name],
    },
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  // "Keep reading" picks the most related pieces — same category first, then
  // the same service — rather than just whatever was published last.
  const { posts: recent } = await getPublishedPosts({ pageSize: 12 });
  const more = rankRelatedPosts(post, recent, 3);
  const relatedServices = servicesForPost(post);
  const mentionedTerms = glossaryMentionedIn(
    `${post.title} ${post.excerpt} ${post.content}`,
  );

  return (
    <article className="pt-10">
      <JsonLd data={blogPostingJsonLd(post)} />

      {/* Article opener — set like a well-composed title page */}
      <Container size="prose">
        <Breadcrumbs
          trail={[
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">
          <span className="rounded-full bg-sage px-3 py-1 text-forest">
            {post.category}
          </span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true" className="text-mint-deep">
            &middot;
          </span>
          <span>{post.readingMinutes} min read</span>
        </div>

        {/* A named, credentialed author is the single strongest trust signal on
            a health article — shown only once the real name is configured, so
            the byline and the BlogPosting author never disagree. */}
        {site.practitioner && (
          <p className="mt-4 text-sm text-muted">
            By{" "}
            <span className="font-semibold text-forest">
              {site.practitioner.name}
            </span>
            {site.practitioner.jobTitle && `, ${site.practitioner.jobTitle}`}
          </p>
        )}

        <h1 className="mt-5 font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.08] text-forest">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-6 font-display text-xl italic leading-[1.6] text-forest-soft">
            {post.excerpt}
          </p>
        )}
        <span aria-hidden="true" className="mt-8 block h-px w-12 bg-mint-deep" />
      </Container>

      <Container size="prose" className="mt-10">
        <Photo
          image={{ src: post.coverImage, alt: post.coverAlt }}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="aspect-[16/9] w-full shadow-lift"
        />
      </Container>

      {/* The reading experience: measured line length, drop cap, pull-quote
          styling for blockquotes — all via prose-serene/prose-article. */}
      <Container size="prose" className="mt-12">
        <div
          className="prose-serene prose-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <PostNextSteps services={relatedServices} terms={mentionedTerms} />

        <div className="relative mt-16 rounded-[2rem] bg-sand p-8 sm:p-10">
          <span
            aria-hidden="true"
            className="absolute -top-6 left-8 select-none font-display text-7xl leading-none text-mint"
          >
            &ldquo;
          </span>
          <p className="font-display text-xl italic leading-[1.65] text-forest">
            Healing isn&rsquo;t about fixing what is broken; it&rsquo;s about
            discovering the strength that was already inside you.
          </p>
          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
          >
            Take your first step
          </Link>
        </div>
      </Container>

      {more.length > 0 && (
        <Section spacing="md" surface="mist" className="mt-16">
          <Container>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] text-forest">
              Keep <em>reading</em>
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((related, i) => (
                <Reveal key={related.slug} delay={i * 0.06} className="h-full">
                  <PostCard post={related} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <FinalCta />
    </article>
  );
}
