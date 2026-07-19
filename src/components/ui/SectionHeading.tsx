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
        <Eyebrow tone={onPine ? "light" : "dark"}>{eyebrow}</Eyebrow>
      )}
      <Tag
        className={cn(
          "font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.1]",
          onPine ? "text-paper" : "text-pine",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={cn(
            "mt-5 max-w-[62ch] text-lg leading-[1.75]",
            onPine ? "text-sage/85" : "text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
