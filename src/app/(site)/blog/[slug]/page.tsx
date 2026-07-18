import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getPublishedPostBySlug,
  getAllPublishedSlugs,
  getLatestPosts,
} from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/ui/PostCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/structured-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const more = (await getLatestPosts(4))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="pt-10">
      <JsonLd data={articleJsonLd(post)} />
      <Container size="prose">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-pine"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to the journal
        </Link>

        <div className="mt-8 flex items-center gap-2 text-sm text-muted">
          <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-pine">
            {post.category}
          </span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h1 className="mt-4 font-display text-4xl leading-[1.1] text-pine sm:text-[2.85rem]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        )}
      </Container>

      <Container size="prose" className="mt-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] shadow-lift">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      </Container>

      <Container size="prose" className="mt-12">
        <div
          className="prose-serene"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-14 rounded-3xl border border-sage-deep/25 bg-sage/40 p-8 text-center">
          <p className="font-display text-xl italic leading-relaxed text-pine">
            Healing isn&rsquo;t about fixing what is broken; it&rsquo;s about
            discovering the strength that was already inside you.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper shadow-soft transition hover:bg-pine/90"
          >
            Take your first step
          </Link>
        </div>
      </Container>

      {more.length > 0 && (
        <Section spacing="md" className="mt-6">
          <Container>
            <h2 className="font-display text-2xl text-pine">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
