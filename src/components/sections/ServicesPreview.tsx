import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/lib/content/services";

export function ServicesPreview() {
  return (
    <Section>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How we help"
          title="Support for every step of the journey"
          intro="Whoever you are and whatever you're facing, there's a gentle place to begin. We offer therapy across three areas of life."
          className="mx-auto"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.06} className="h-full">
              <ServiceCard service={service} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
