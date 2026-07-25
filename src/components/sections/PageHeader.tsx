import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealText, RiseIn } from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

/**
 * Editorial page opener: left-aligned by default, confident display scale,
 * with a soft mint wash behind the composition.
 *
 * The entrance is CSS, not Framer Motion — this h1 is the LCP element on every
 * inner page, so it animates from the first paint rather than waiting for
 * hydration. The words rise in a staggered wave; the eyebrow and intro follow.
 * See components/ui/RevealText.tsx.
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
        className="wash-drift pointer-events-none absolute -right-40 -top-32 h-[24rem] w-[24rem] rounded-full bg-mint/10 blur-3xl"
      />
      <Container>
        <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
          {eyebrow && (
            <Eyebrow className={cn("rise-in", centered && "justify-center")}>
              {eyebrow}
            </Eyebrow>
          )}
          <h1 className="font-display text-[clamp(2.5rem,5.4vw,3.9rem)] leading-[1.05] text-forest">
            <RevealText>{title}</RevealText>
          </h1>
          {intro && (
            <RiseIn
              as="p"
              delay={3}
              className={cn(
                "mt-5 max-w-[60ch] text-lg leading-[1.75] text-muted",
                centered && "mx-auto",
              )}
            >
              {intro}
            </RiseIn>
          )}
        </div>
      </Container>
    </section>
  );
}
