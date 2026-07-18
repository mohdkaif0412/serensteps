import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Surface = "paper" | "sage" | "pine";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Background surface. Sage for soft bands, pine for grounding CTAs. */
  surface?: Surface;
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg";
};

const surfaces: Record<Surface, string> = {
  paper: "",
  sage: "bg-sage/45",
  pine: "bg-pine text-paper",
};

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
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
      className={cn("scroll-mt-24", spacings[spacing], surfaces[surface], className)}
    >
      {children}
    </section>
  );
}
