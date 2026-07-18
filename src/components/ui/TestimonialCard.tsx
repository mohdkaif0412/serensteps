import { Quote } from "lucide-react";
import type { PublicTestimonial } from "@/lib/queries";

export function TestimonialCard({ item }: { item: PublicTestimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-sage-deep/20 bg-paper p-7 shadow-soft">
      <Quote className="size-7 text-honey" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 font-display text-lg italic leading-relaxed text-pine">
        {`“${item.quote}”`}
      </blockquote>
      <figcaption className="mt-6 text-sm">
        <span className="font-semibold text-pine">{item.name}</span>
        {item.role && <span className="text-muted"> &middot; {item.role}</span>}
      </figcaption>
    </figure>
  );
}
