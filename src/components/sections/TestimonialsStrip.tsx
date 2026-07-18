import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicTestimonial } from "@/lib/queries";

export function TestimonialsStrip({ items }: { items: PublicTestimonial[] }) {
  // Hide gracefully when there are no testimonials.
  if (!items.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="In their words"
          title="Small steps, real change"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item, i) => (
            <Reveal key={i} delay={i * 0.06} className="h-full">
              <TestimonialCard item={item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
