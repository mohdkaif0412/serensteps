import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small-caps section label with a short drawn mint rule — the consistent
 * editorial opener above headings sitewide.
 *
 * The rule flips tone with the surface: pure mint reads beautifully on forest
 * but only manages 2.1:1 on paper, so light surfaces get mint-deep.
 */
export function Eyebrow({
  children,
  tone = "dark",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  /** `light` for forest surfaces. */
  tone?: "dark" | "light";
  className?: string;
  /**
   * `span` when the eyebrow sits *inside* a heading as its kicker — it then
   * becomes part of the heading text (e.g. "About Serene Steps: A gentle place
   * to heal and grow"), which is what search engines and screen readers read.
   * Laid out as its own line so it looks identical to the standalone `p`.
   */
  as?: "p" | "span";
}) {
  return (
    <Tag
      className={cn(
        "mb-3 items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em]",
        Tag === "span" ? "flex w-fit leading-normal" : "inline-flex",
        tone === "light" ? "text-sage" : "text-muted",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-px w-8",
          tone === "light" ? "bg-mint" : "bg-mint-deep",
        )}
        aria-hidden="true"
      />
      {children}
    </Tag>
  );
}

/**
 * An `Eyebrow` set inside a heading as its kicker, plus a separator only
 * assistive tech and text extractors see — so the heading reads
 * "Kicker: Title" rather than "Kicker Title".
 */
export function HeadingKicker({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <>
      <Eyebrow as="span" tone={tone} className={className}>
        {children}
      </Eyebrow>
      <span className="sr-only">: </span>
    </>
  );
}
