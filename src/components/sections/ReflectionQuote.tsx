import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

// Kept as a string constant (not JSX text) so the curly quotes/apostrophes
// render cleanly without escaping gymnastics.
const FITZGERALD =
  "For what it's worth: it's never too late — or in my case, too early — to be whoever you want to be. There's no time limit, stop whenever you want. You can change or stay the same, there are no rules to this thing. We can make the best or the worst of it. I hope you make the best of it. I hope you see things that startle you. I hope you feel things you've never felt before. I hope you meet people with a different point of view. I hope you live a life you're proud of. And if you find that you're not, I hope you have the courage to start over again.";

export function ReflectionQuote() {
  return (
    <Section spacing="lg">
      <Container size="prose">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            A gentle reminder
          </p>
          <blockquote className="mt-6 font-display text-xl italic leading-relaxed text-pine sm:text-2xl sm:leading-[1.6]">
            {`“${FITZGERALD}”`}
          </blockquote>
          <cite className="mt-6 block text-sm not-italic text-muted">
            — F. Scott Fitzgerald
          </cite>
        </Reveal>
      </Container>
    </Section>
  );
}
