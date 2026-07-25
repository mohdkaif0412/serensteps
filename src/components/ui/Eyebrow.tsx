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
}: {
  children: ReactNode;
  /** `light` for forest surfaces. */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-3 inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em]",
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
    </p>
  );
}
