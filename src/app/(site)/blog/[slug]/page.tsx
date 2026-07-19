import type { Metadata } from "next";
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
import { Photo } from "@/components/ui/Photo";
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

      {/* Article opener — set like a well-composed title page */}
      <Container size="prose">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-pine"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span className="link-underline group-hover:bg-[length:100%_1px]">
            Back to the journal
          </span>
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">
          <span className="rounded-full bg-sage px-3 py-1 text-pine">
            {post.category}
          </span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true" className="text-honey">
            &middot;
          </span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h1 className="mt-5 font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.08] text-pine">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-6 font-display text-xl italic leading-[1.6] text-pine-soft">
            {post.excerpt}
          </p>
        )}
        <span aria-hidden="true" className="mt-8 block h-px w-12 bg-honey" />
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

        <div className="relative mt-16 rounded-[2rem] bg-sand p-8 sm:p-10">
          <span
            aria-hidden="true"
            className="absolute -top-6 left-8 select-none font-display text-7xl leading-none text-honey"
          >
            &ldquo;
          </span>
          <p className="font-display text-xl italic leading-[1.65] text-pine">
            Healing isn&rsquo;t about fixing what is broken; it&rsquo;s about
            discovering the strength that was already inside you.
          </p>
          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
          >
            Take your first step
          </Link>
        </div>
      </Container>

      {more.length > 0 && (
        <Section spacing="md" surface="mist" className="mt-16">
          <Container>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] text-pine">
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
