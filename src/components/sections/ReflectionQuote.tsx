import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Kept as a string constant (not JSX text) so the curly quotes/apostrophes
// render cleanly without escaping gymnastics.
const FITZGERALD =
  "For what it's worth: it's never too late — or in my case, too early — to be whoever you want to be. There's no time limit, stop whenever you want. You can change or stay the same, there are no rules to this thing. We can make the best or the worst of it. I hope you make the best of it. I hope you see things that startle you. I hope you feel things you've never felt before. I hope you meet people with a different point of view. I hope you live a life you're proud of. And if you find that you're not, I hope you have the courage to start all over again.";

/**
 * A quiet, beautifully-set pull-quote moment: left-aligned, an oversized
 * mint quotation glyph breaking the margin, and a drawn rule to close.
 */
export function ReflectionQuote() {
  return (
    <Section spacing="lg">
      <Container size="prose" className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 left-1 select-none font-display text-[8rem] leading-none text-mint-deep/25 sm:-left-16 sm:-top-8 sm:text-[10rem]"
        >
          &ldquo;
        </span>
        <Reveal className="relative">
          <Eyebrow>A gentle reminder</Eyebrow>
          <blockquote className="mt-4 font-display text-[clamp(1.35rem,2.7vw,1.85rem)] italic leading-[1.65] text-forest">
            {FITZGERALD}
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-mint-deep" />
            <cite className="text-[0.78rem] font-semibold uppercase not-italic tracking-[0.2em] text-muted">
              F. Scott Fitzgerald
            </cite>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
