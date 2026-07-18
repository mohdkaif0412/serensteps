import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { services, type Service } from "@/lib/content/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Warm, evidence-based therapy for children & teens, individuals, and couples & families. Explore how Serene Steps can support you, one step at a time.",
};

export default function ServicesPage() {
  return (
    <StepsPath steps={3}>
      <PageHeader
        eyebrow="Our services"
        title="Support for children, individuals, couples & families"
        intro="Whoever you are and whatever you're carrying, there's a gentle place to begin. Here's a closer look at how we can help — and remember, these lists are a starting point, not a checklist you must fit."
      />

      <div className="mt-4">
        {services.map((service, i) => (
          <ServiceSection key={service.slug} service={service} reversed={i % 2 === 1} />
        ))}
      </div>

      <FinalCta />
    </StepsPath>
  );
}

function ServiceSection({
  service,
  reversed,
}: {
  service: Service;
  reversed: boolean;
}) {
  return (
    <Section id={service.slug} surface={reversed ? "sage" : "paper"} spacing="md">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className={cn(reversed && "lg:order-2")}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className={cn(reversed && "lg:order-1")}>
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted">
                <span className="size-1.5 rounded-full bg-honey" aria-hidden="true" />
                {service.audience}
              </p>
              <h2 className="font-display text-3xl leading-tight text-pine sm:text-4xl">
                {service.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {service.intro}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-7 text-sm font-medium uppercase tracking-[0.14em] text-pine/70">
                What we help with
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {service.helps.map((help) => (
                  <li key={help} className="flex items-start gap-2.5 text-muted">
                    <Check
                      className="mt-1 size-4 shrink-0 text-honey"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{help}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8">
                <Button href="/contact" variant="primary">
                  Book a first session
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
