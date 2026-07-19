import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

/**
 * Editorial page opener: left-aligned by default, confident display scale,
 * with a soft honey wash behind the composition.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  /** Pass <em>…</em> around a phrase for a Newsreader-italic accent. */
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden pb-4 pt-8 sm:pb-6 sm:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-32 h-[24rem] w-[24rem] rounded-full bg-honey/10 blur-3xl"
      />
      <Container>
        <Reveal className={cn("max-w-3xl", centered && "mx-auto text-center")}>
          {eyebrow && (
            <Eyebrow className={cn(centered && "justify-center")}>{eyebrow}</Eyebrow>
          )}
          <h1 className="font-display text-[clamp(2.5rem,5.4vw,3.9rem)] leading-[1.05] text-pine">
            {title}
          </h1>
          {intro && (
            <p
              className={cn(
                "mt-5 max-w-[60ch] text-lg leading-[1.75] text-muted",
                centered && "mx-auto",
              )}
            >
              {intro}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
