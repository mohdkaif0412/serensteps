import type { ElementType, ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  /** Pass <em>…</em> around a phrase to set it in Newsreader italic. */
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: ElementType;
  className?: string;
  /** Use on dark (forest) surfaces to flip the text colors. */
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
  const onForest = tone === "light";
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow tone={onForest ? "light" : "dark"}>{eyebrow}</Eyebrow>
      )}
      <Tag
        className={cn(
          "font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.1]",
          onForest ? "text-paper" : "text-forest",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={cn(
            "mt-4 max-w-[62ch] text-lg leading-[1.75]",
            onForest ? "text-sage/85" : "text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
