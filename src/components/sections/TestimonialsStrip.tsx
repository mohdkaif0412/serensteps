import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicTestimonial } from "@/lib/queries";
import { cn } from "@/lib/utils";

// Each voice sits on its own layer of paper, stepping gently downward.
const stagger = ["", "lg:translate-y-10", "lg:translate-y-20"];
const tints = ["bg-cream", "bg-sage-mist", "bg-sand"];

export function TestimonialsStrip({ items }: { items: PublicTestimonial[] }) {
  // Hide gracefully when there are no testimonials.
  if (!items.length) return null;

  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title={
            <>
              Small steps, <em>real change</em>
            </>
          }
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:pb-20">
          {items.slice(0, 3).map((item, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              className={cn("h-full", stagger[i])}
            >
              <TestimonialCard item={item} className={tints[i]} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
