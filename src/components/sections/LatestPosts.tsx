import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicPost } from "@/lib/queries";

/**
 * Journal preview as a small magazine spread: one lead piece, the rest as a
 * quiet reading list beside it.
 */
export function LatestPosts({ posts }: { posts: PublicPost[] }) {
  if (!posts.length) return null;

  const [lead, ...rest] = posts.slice(0, 3);

  return (
    <Section surface="mist" spacing="lg">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="From the journal"
            title={
              <>
                Gentle reads <em>for the journey</em>
              </>
            }
            className="max-w-xl"
          />
          <Reveal>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-pine"
            >
              <span className="link-underline group-hover:bg-[length:100%_1px]">
                All articles
              </span>
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <Reveal className="h-full">
            <PostCard post={lead} />
          </Reveal>
          {rest.length > 0 && (
            <Reveal delay={0.08} className="self-center">
              <div className="divide-y divide-sage-deep/25 border-y border-sage-deep/25">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} variant="row" />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  );
}
