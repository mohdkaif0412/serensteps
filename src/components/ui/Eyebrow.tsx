import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small-caps section label with a short drawn honey rule — the consistent
 * editorial opener above headings sitewide.
 */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  /** `light` for pine surfaces. */
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
      <span className="inline-block h-px w-8 bg-honey" aria-hidden="true" />
      {children}
    </p>
  );
}
