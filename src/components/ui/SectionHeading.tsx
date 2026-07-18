import type { ElementType, ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: ElementType;
  className?: string;
  /** Use on dark (pine) surfaces to flip the text colors. */
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  className,
  tone = "dark",
}: SectionHeadingProps) {
  const onPine = tone === "light";
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em]",
            onPine ? "text-sage" : "text-muted",
            align === "center" && "justify-center",
          )}
        >
          <span className="size-1.5 rounded-full bg-honey" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "font-display text-3xl leading-tight sm:text-4xl",
          onPine ? "text-paper" : "text-pine",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            onPine ? "text-sage/85" : "text-muted",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
