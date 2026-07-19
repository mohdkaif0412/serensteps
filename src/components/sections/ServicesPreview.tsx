import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { services } from "@/lib/content/services";
import { cn } from "@/lib/utils";

// Each row steps a little further right — a quiet staircase, one step at a time.
const stepIndent = ["", "lg:ml-16", "lg:ml-32"];

/**
 * The services as an editorial index — numbered rows with arched thumbnails —
 * rather than three identical cards.
 */
export function ServicesPreview() {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          eyebrow="How we help"
          title={
            <>
              Support for <em>every step</em> of the journey
            </>
          }
          intro="Whoever you are and whatever you're facing, there's a gentle place to begin. We offer therapy across three areas of life."
        />

        <div className="mt-14">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05} className={cn(stepIndent[i])}>
              <Link
                href={`/services#${service.slug}`}
                className="group grid items-center gap-x-8 gap-y-4 border-t border-sage-deep/25 py-8 transition-colors duration-300 last:border-b sm:grid-cols-[auto_1fr_auto] sm:py-9"
              >
                {/* Index numeral + thumbnail */}
                <div className="flex items-center gap-6">
                  <span
                    className="font-display text-lg italic text-honey-deep"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <Photo
                    image={service.image}
                    mask="arch"
                    sizes="112px"
                    className="hidden h-32 w-24 shrink-0 shadow-soft transition-transform duration-500 ease-soft group-hover:-translate-y-1 group-hover:rotate-2 sm:block"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-pine transition-colors duration-300 sm:text-3xl">
                    <span className="link-underline group-hover:bg-[length:100%_1px]">
                      {service.title}
                    </span>
                  </h3>
                  <p className="mt-2 line-clamp-2 max-w-[58ch] leading-relaxed text-muted">
                    {service.intro}
                  </p>
                </div>

                <span
                  className="grid size-11 shrink-0 place-items-center justify-self-start rounded-full border border-sage-deep/40 text-pine transition-all duration-300 ease-soft group-hover:border-honey group-hover:bg-honey group-hover:shadow-soft sm:justify-self-end"
                  aria-hidden="true"
                >
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
