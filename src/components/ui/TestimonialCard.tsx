import type { PublicTestimonial } from "@/lib/queries";
import { cn } from "@/lib/utils";

/**
 * A set quotation, not a boxy review card: oversized Newsreader quote glyph
 * breaking the top edge, italic serif body, honey-dash attribution. Surface
 * tint (`cream`, `sage-mist`, `sand`) comes from the caller so a group of
 * these reads as layered paper.
 */
export function TestimonialCard({
  item,
  className,
}: {
  item: PublicTestimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] border border-sage-deep/20 bg-cream p-7 pt-10 shadow-soft",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-6 left-6 select-none font-display text-7xl leading-none text-honey"
      >
        &ldquo;
      </span>
      <blockquote className="flex-1 font-display text-lg italic leading-[1.7] text-pine">
        {item.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 text-sm">
        <span aria-hidden="true" className="h-px w-6 bg-honey" />
        <span>
          <span className="font-semibold text-pine">{item.name}</span>
          {item.role && <span className="text-muted"> &middot; {item.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
