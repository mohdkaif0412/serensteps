import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Surface = "paper" | "mist" | "sage" | "sand" | "forest" | "forest-deep";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Layered surface system: mist/sage/sand for soft tinted bands,
      forest/forest-deep for grounding dark moments. */
  surface?: Surface;
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg";
};

const surfaces: Record<Surface, string> = {
  paper: "",
  mist: "bg-sage-mist",
  sage: "bg-sage/45",
  sand: "bg-sand",
  forest: "bg-forest text-paper",
  "forest-deep": "bg-forest-deep text-paper",
};

// The sitewide vertical-rhythm scale. Deliberately compact: calm and
// composed, never sparse — adjacent sections should read as one flowing
// page, not islands separated by blank bands.
const spacings = {
  sm: "py-8 sm:py-10",
  md: "py-10 sm:py-14",
  lg: "py-12 sm:py-18",
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
