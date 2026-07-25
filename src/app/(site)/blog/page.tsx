import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/ui/PostCard";
import { getPublishedPosts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Gentle, practical writing on anxiety, relationships, parenting, starting therapy, and reflective practice — from the Serene Step journal.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPublishedPosts({ page });

  // Magazine front: the newest piece leads full-width on page one,
  // the rest settle into a staggered grid.
  const [lead, ...rest] = posts;
  const showFeature = page === 1 && posts.length > 1;
  const gridPosts = showFeature ? rest : posts;

  return (
    <>
      <PageHeader
        eyebrow="The journal"
        title={
          <>
            Gentle reads <em>for the journey</em>
          </>
        }
        intro="Honest, practical reflections on the things we carry — and small, kind ways to feel a little lighter."
      />

      <Section spacing="md">
        <Container>
          {posts.length ? (
            <>
              {showFeature && (
                <Reveal className="mb-10">
                  <PostCard post={lead} variant="feature" />
                </Reveal>
              )}

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post, i) => (
                  <Reveal
                    key={post.slug}
                    delay={(i % 3) * 0.06}
                    className={cn("h-full", i % 3 === 1 && "lg:translate-y-8")}
                  >
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-center gap-2"
                  aria-label="Blog pagination"
                >
                  <PageLink
                    href={`/blog?page=${page - 1}`}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </PageLink>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <PageLink
                      key={n}
                      href={`/blog?page=${n}`}
                      active={n === page}
                      aria-label={`Page ${n}`}
                      aria-current={n === page ? "page" : undefined}
                    >
                      {n}
                    </PageLink>
                  ))}
                  <PageLink
                    href={`/blog?page=${page + 1}`}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </PageLink>
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-sage-deep/40 bg-cream p-12 text-center">
              <h2 className="font-display text-2xl text-forest">
                New writing is on its way
              </h2>
              <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted">
                We&rsquo;re working on some gentle reads for you. Check back soon.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "children">) {
  const classes = cn(
    "inline-flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ease-soft",
    active
      ? "bg-forest text-paper shadow-soft"
      : "border border-sage-deep/40 text-forest hover:-translate-y-0.5 hover:border-mint-deep hover:bg-mint-soft",
    disabled && "pointer-events-none opacity-40",
  );
  if (disabled) {
    return (
      <span className={classes} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
