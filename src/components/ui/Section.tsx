import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Surface = "paper" | "mist" | "sage" | "sand" | "pine" | "pine-deep";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Layered surface system: mist/sage/sand for soft tinted bands,
      pine/pine-deep for grounding dark moments. */
  surface?: Surface;
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg";
};

const surfaces: Record<Surface, string> = {
  paper: "",
  mist: "bg-sage-mist",
  sage: "bg-sage/45",
  sand: "bg-sand",
  pine: "bg-pine text-paper",
  "pine-deep": "bg-pine-deep text-paper",
};

// Enough breathing room to feel editorial without leaving near-empty
// viewports between content blocks.
const spacings = {
  sm: "py-10 sm:py-14",
  md: "py-14 sm:py-20",
  lg: "py-16 sm:py-28",
} as const;

export function Section({
  id,
  className,
  children,
  surface = "paper",
  spacing = "md",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24",
        spacings[spacing],
        surfaces[surface],
        className,
      )}
    >
      {children}
    </section>
  );
}
