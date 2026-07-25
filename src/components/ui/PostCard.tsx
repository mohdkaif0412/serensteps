import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicPost } from "@/lib/queries";
import { formatDate, cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";

type Variant = "card" | "feature" | "row";

function Meta({ post, className }: { post: PublicPost; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted",
        className,
      )}
    >
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden="true" className="text-mint-deep">
        &middot;
      </span>
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}

/**
 * One post, three editorial shapes:
 * - `card`    — vertical card for grids
 * - `feature` — wide split lead for the top of an index
 * - `row`     — compact horizontal entry for side stacks
 */
export function PostCard({
  post,
  variant = "card",
}: {
  post: PublicPost;
  variant?: Variant;
}) {
  const cover = { src: post.coverImage, alt: post.coverAlt };

  if (variant === "feature") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-[2rem] border border-sage-deep/20 bg-cream shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/25 hover:shadow-float md:grid-cols-[1.15fr_1fr]"
      >
        <div className="relative min-h-64 overflow-hidden md:min-h-full">
          <Photo
            image={cover}
            sizes="(max-width: 768px) 100vw, 55vw"
            className="absolute inset-0 h-full rounded-none transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
          />
          <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3.5 py-1.5 text-xs font-medium text-forest backdrop-blur">
            {post.category}
          </span>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <Meta post={post} />
          <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.15] text-forest">
            <span className="link-underline group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
          </h3>
          <p className="mt-4 line-clamp-3 leading-[1.75] text-muted">{post.excerpt}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
            Read more
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-center gap-5 py-5"
      >
        <Photo
          image={cover}
          sizes="112px"
          className="h-24 w-28 shrink-0 rounded-2xl shadow-soft transition-transform duration-500 ease-soft group-hover:-translate-y-0.5 group-hover:rotate-1"
        />
        <div className="min-w-0">
          <Meta post={post} />
          <h3 className="mt-2 line-clamp-2 font-display text-lg leading-snug text-forest">
            <span className="link-underline group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-sage-deep/20 bg-cream shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/25 hover:shadow-float"
    >
      <div className="relative overflow-hidden">
        <Photo
          image={cover}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="aspect-[16/10] rounded-none transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-forest backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <Meta post={post} />
        <h3 className="mt-3 font-display text-xl leading-snug text-forest">
          <span className="link-underline group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </h3>
        <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
          Read more
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
