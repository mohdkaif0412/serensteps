import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { ValuesWave } from "@/components/sections/ValuesWave";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { aboutIntro, ourStory } from "@/lib/content/about";
import { img } from "@/lib/images";
import { bookingCta, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Serene Step is a warm, non-clinical practice built on one belief: the strength to heal is already inside you. Read our story and the six values that shape every session.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StepsPath steps={5}>
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />
      <PageHeader
        eyebrow={`About ${site.name}`}
        title={
          <>
            A gentle place to <em>heal and grow</em>
          </>
        }
      />

      {/* The client's opening questions, set as invitations rather than bullets */}
      <Section spacing="md">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <ul className="space-y-5">
                {aboutIntro.map((line) => (
                  <li key={line} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-3 size-1.5 shrink-0 rounded-full bg-mint-deep"
                    />
                    <p className="max-w-[46ch] font-display text-[clamp(1.25rem,2.4vw,1.6rem)] leading-[1.45] text-forest">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5 lg:self-center">
              <div className="rounded-[1.75rem] border border-mint-deep/25 bg-mint-soft p-6 sm:p-7">
                <p className="font-display text-xl leading-snug text-forest">
                  Take a step forward.
                </p>
                <p className="mt-2 leading-relaxed text-muted">
                  Whenever you&rsquo;re ready — there&rsquo;s no rush, and no
                  commitment in asking.
                </p>
                <div className="mt-5">
                  <Button href={bookingCta.href} variant="primary">
                    Book your first session
                    <ArrowRight
                      className="hidden size-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:inline-block"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Our story — the illustration in the brand's own hand, letter-like text */}
      <Section spacing="lg" className="overflow-hidden">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Not wrapped in <Reveal>, and `priority`: on a desktop viewport
                this portrait is the LCP element, so it must neither be
                lazy-loaded nor sit behind an opacity gate. */}
            <div className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-5 bottom-6 top-16 rotate-2 rounded-[2.5rem] bg-sand"
                />
                <Photo
                  image={img.about}
                  mask="arch"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="relative aspect-[4/5] w-full shadow-lift"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <Eyebrow>Our story</Eyebrow>
                <h2 className="font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.12] text-forest">
                  We walk <em>alongside</em> you, step by step
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-5 max-w-[58ch] space-y-4 text-lg leading-[1.8] text-muted">
                  {ourStory.map((paragraph, i) => (
                    <p key={paragraph.slice(0, 32)} className={i === 0 ? "dropcap" : undefined}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <span aria-hidden="true" className="mt-6 block h-px w-12 bg-mint-deep" />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* The six values, riding the wave down the page */}
      <Section surface="mist" spacing="lg">
        <Container>
          <SectionHeading
            eyebrow="Our values"
            title={
              <>
                What shapes <em>every session</em>
              </>
            }
            intro="They're also the shape of the work itself — beginning with safety, ending with a proper close."
          />
          <ValuesWave />
        </Container>
      </Section>

      <FinalCta />
    </StepsPath>
  );
}
