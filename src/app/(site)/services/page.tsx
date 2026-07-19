import type { Metadata } from "next";
import { Check } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { services, type Service } from "@/lib/content/services";
import { bookingCta } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Warm, evidence-based therapy for children & teens, individuals, and couples & families. Explore how Serene Steps can support you, one step at a time.",
};

// Each audience gets its own surface so consecutive sections never share a shape.
const surfaces = ["paper", "mist", "paper"] as const;

export default function ServicesPage() {
  return (
    <StepsPath steps={3}>
      <PageHeader
        eyebrow="Our services"
        title={
          <>
            Support for children, individuals, <em>couples & families</em>
          </>
        }
        intro="Whoever you are and whatever you're carrying, there's a gentle place to begin. Here's a closer look at how we can help — and remember, these lists are a starting point, not a checklist you must fit."
      />

      <div className="mt-6">
        {services.map((service, i) => (
          <ServiceSection
            key={service.slug}
            service={service}
            index={i}
            reversed={i % 2 === 1}
            surface={surfaces[i]}
          />
        ))}
      </div>

      <FinalCta />
    </StepsPath>
  );
}

function ServiceSection({
  service,
  index,
  reversed,
  surface,
}: {
  service: Service;
  index: number;
  reversed: boolean;
  surface: "paper" | "mist";
}) {
  return (
    <Section id={service.slug} surface={surface} spacing="lg" className="overflow-hidden">
      {/* Oversized watermark numeral — quiet editorial depth, clipped by the section */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-10 select-none font-display text-[11rem] italic leading-none text-sage-deep/15 sm:text-[15rem]",
          reversed ? "left-4 sm:left-10" : "right-4 sm:right-10",
        )}
      >
        0{index + 1}
      </span>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal
            className={cn(
              "mx-auto w-full max-w-md lg:mx-0 lg:max-w-none",
              reversed ? "lg:order-2 lg:col-span-5 lg:col-start-8" : "lg:col-span-5",
            )}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className={cn(
                  "absolute -inset-x-5 bottom-8 top-14 rounded-[2.5rem]",
                  reversed ? "rotate-2 bg-sage/60" : "-rotate-2 bg-sand",
                )}
              />
              <Photo
                image={service.image}
                mask="arch"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="relative aspect-[4/5] w-full shadow-lift"
              />
            </div>
          </Reveal>

          <div
            className={cn(
              reversed
                ? "lg:order-1 lg:col-span-6"
                : "lg:col-span-6 lg:col-start-7",
            )}
          >
            <Reveal>
              <Eyebrow>{service.audience}</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.1] text-pine">
                {service.title}
              </h2>
              <p className="mt-5 max-w-[58ch] text-lg leading-[1.8] text-muted">
                {service.intro}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-pine/70">
                <span className="inline-block h-px w-8 bg-honey" aria-hidden="true" />
                What we help with
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {service.helps.map((help) => (
                  <li key={help} className="flex items-start gap-2.5 leading-relaxed text-muted">
                    <Check
                      className="mt-1.5 size-3.5 shrink-0 text-honey-deep"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{help}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-9">
                <Button href={bookingCta.href} variant="primary">
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
