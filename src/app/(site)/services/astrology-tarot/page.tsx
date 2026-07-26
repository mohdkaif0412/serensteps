import type { Metadata } from "next";
import { StepsPath } from "@/components/ui/StepsPath";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { WaveMark } from "@/components/ui/WaveMark";
import { Photo } from "@/components/ui/Photo";
import { RevealText, RiseIn } from "@/components/ui/RevealText";
import { FinalCta } from "@/components/sections/FinalCta";
import { BackToServices, RelatedServices } from "@/components/sections/ServiceBlocks";
import {
  TermsCallout,
  AstrologyBlock,
  TarotCard,
  WhatWeBelieveBand,
} from "@/components/sections/ReflectiveBlocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, reflectiveServiceJsonLd } from "@/lib/structured-data";
import {
  astrologyServices,
  tarotServices,
  tarotIntro,
  reflectiveIntro,
  REFLECTIVE_PATH,
} from "@/lib/content/services";
import { img } from "@/lib/images";
import { site } from "@/lib/site";

const DESCRIPTION =
  "At Serene Step, astrology and tarot are reflective tools, never predictions and never a substitute for mental-health treatment. Birth chart, year-ahead and relationship readings, and five tarot guidance sessions — each paired with psychological understanding.";

export const metadata: Metadata = {
  title: "Astrology & Tarot",
  description: DESCRIPTION,
  alternates: { canonical: REFLECTIVE_PATH },
  openGraph: {
    type: "website",
    title: "Astrology & Tarot",
    description: DESCRIPTION,
    url: REFLECTIVE_PATH,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology & Tarot",
    description: DESCRIPTION,
  },
};

/**
 * The reflective offering, on a page of its own.
 *
 * The framing is load-bearing and comes first: the terms callout sits in the
 * opener, above every reading, at the heaviest border weight on the site. It is
 * never an accordion and never moves to the foot of the page.
 */
export default function AstrologyTarotPage() {
  return (
    <StepsPath steps={5}>
      <JsonLd data={reflectiveServiceJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Services", path: "/services" },
          { name: "Astrology & Tarot", path: REFLECTIVE_PATH },
        ])}
      />

      {/* ── Opener ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-6 pt-8 sm:pt-12">
        <div
          aria-hidden="true"
          className="wash-drift pointer-events-none absolute -right-40 -top-32 size-[26rem] rounded-full bg-mint/10 blur-3xl"
        />
        <Container className="relative">
          <RiseIn>
            <BackToServices />
          </RiseIn>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <RiseIn>
                <Eyebrow>A unique integrative approach</Eyebrow>
              </RiseIn>
              <h1 className="font-display text-[clamp(2.3rem,5vw,3.5rem)] leading-[1.06] text-forest">
                <RevealText>
                  Reflective guidance, <em>not prediction</em>
                </RevealText>
              </h1>
              <div className="mt-6 max-w-[56ch] space-y-4 text-lg leading-[1.8] text-muted">
                {reflectiveIntro.body.map((paragraph, i) => (
                  <RiseIn as="p" key={paragraph.slice(0, 32)} delay={i === 0 ? 3 : 4}>
                    {paragraph}
                  </RiseIn>
                ))}
              </div>
              <WaveMark className="mt-8 h-10 text-mint-deep/50" />
            </div>

            {/* The terms sit beside the intro, above every service — for this
                offering the framing *is* the offering. They stay second in the
                DOM (and so directly under the intro on a phone); on a wide
                screen the photograph slots between the two. */}
            <div className="rise-in rise-delay-3 lg:order-3 lg:col-span-4">
              <TermsCallout />
            </div>

            {/* This page carries real photography for the same reason its three
                sibling service pages do — the same arch, the same duotone. */}
            <div className="rise-in rise-delay-2 mx-auto w-full max-w-[15rem] lg:order-2 lg:col-span-3 lg:mx-0 lg:max-w-none">
              <Photo
                image={img.astrologyTarot}
                mask="arch"
                // Not `priority`: unlike the sibling heroes this is a small
                // side element, and on a phone it sits below the fold. The LCP
                // here is the heading — nothing should compete with it.
                sizes="(max-width: 1024px) 60vw, 22vw"
                className="aspect-[3/4] w-full shadow-lift"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Astrology ────────────────────────────────────────────── */}
      <WaveEdge className="-mb-px mt-6 text-sage-mist" />
      <Section id="astrology" surface="mist" spacing="lg">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Astrology services</Eyebrow>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
              Three ways to <em>read the map</em>
            </h2>
            <p className="mt-4 text-lg leading-[1.8] text-muted">
              Each reading is set out the same way: what it explores, how it is
              paired with psychological understanding, and what you actually
              leave with.
            </p>
          </Reveal>

          <div className="mt-10 space-y-7">
            {astrologyServices.map((service, i) => (
              <AstrologyBlock key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Tarot ────────────────────────────────────────────────── */}
      <Section id="tarot" spacing="lg">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Tarot guidance sessions</Eyebrow>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
              A mirror, <em>not a forecast</em>
            </h2>
            <p className="mt-4 text-lg leading-[1.8] text-muted">{tarotIntro}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tarotServices.map((service, i) => (
              <TarotCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* The terms again, at the foot — a reader who scrolled straight to a
          reading should still meet them before they book. */}
      <Section surface="sand" spacing="md">
        <Container size="prose">
          <Reveal>
            <TermsCallout headingId="reflective-terms-heading-footer" />
          </Reveal>
        </Container>
      </Section>

      <WhatWeBelieveBand />
      <RelatedServices currentSlug="astrology-tarot" />
      <FinalCta />
    </StepsPath>
  );
}
