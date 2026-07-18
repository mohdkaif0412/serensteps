import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicPost } from "@/lib/queries";

export function LatestPosts({ posts }: { posts: PublicPost[] }) {
  if (!posts.length) return null;

  return (
    <Section surface="sage">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="From the journal"
            title="Gentle reads for the journey"
            className="max-w-xl"
          />
          <Reveal>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-pine"
            >
              All articles
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06} className="h-full">
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
