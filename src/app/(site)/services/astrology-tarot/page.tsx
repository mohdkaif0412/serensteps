import { StepsPath } from "@/components/ui/StepsPath";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, HeadingKicker } from "@/components/ui/Eyebrow";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { WaveMark } from "@/components/ui/WaveMark";
import { Photo } from "@/components/ui/Photo";
import { RevealText, RiseIn } from "@/components/ui/RevealText";
import { FinalCta } from "@/components/sections/FinalCta";
import { RelatedServices } from "@/components/sections/ServiceBlocks";
import { KeepReading } from "@/components/sections/InternalLinks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  TermsCallout,
  AstrologyBlock,
  TarotCard,
  WhatWeBelieveBand,
} from "@/components/sections/ReflectiveBlocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { reflectiveServiceJsonLd } from "@/lib/structured-data";
import { getPublishedPosts } from "@/lib/queries";
import { glossaryForService, postsForService } from "@/lib/links";
import {
  astrologyServices,
  tarotServices,
  tarotIntro,
  reflectiveIntro,
  REFLECTIVE_PATH,
} from "@/lib/content/services";
import { img } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Astrology & Tarot as Reflective Guidance",
  description: `At ${site.name}, astrology and tarot are reflective tools, never predictions and never a substitute for therapy. Explore chart readings and tarot sessions.`,
  path: REFLECTIVE_PATH,
});

/**
 * The reflective offering, on a page of its own.
 *
 * The framing is load-bearing and comes first: the terms callout sits in the
 * opener, above every reading, at the heaviest border weight on the site. It is
 * never an accordion and never moves to the foot of the page.
 */
// The journal strip underneath reads the database — same short revalidate as
// every other content page, so a database-less build self-heals.
export const revalidate = 300;

export default async function AstrologyTarotPage() {
  const { posts } = await getPublishedPosts({ pageSize: 12 });

  return (
    <StepsPath steps={5}>
      <JsonLd data={reflectiveServiceJsonLd()} />

      {/* ── Opener ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-6 pt-8 sm:pt-12">
        <div
          aria-hidden="true"
          className="wash-drift pointer-events-none absolute -right-40 -top-32 size-[26rem] rounded-full bg-mint/10 blur-3xl"
        />
        <Container className="relative">
          <Breadcrumbs
            trail={[
              { name: "Services", path: "/services" },
              { name: "Astrology & tarot", path: REFLECTIVE_PATH },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              {/* The kicker names the offering, so the h1 reads "Astrology &
                  tarot: Reflective guidance, not prediction" — the framing
                  and the subject together. */}
              <h1 className="font-display text-[clamp(2.3rem,5vw,3.5rem)] leading-[1.06] text-forest">
                <HeadingKicker className="rise-in">Astrology &amp; tarot</HeadingKicker>
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
            <TermsCallout
              headingId="reflective-terms-heading-footer"
              heading="Before you book a reading"
            />
          </Reveal>
        </Container>
      </Section>

      <WhatWeBelieveBand />
      <KeepReading
        posts={postsForService("astrology-tarot", posts)}
        terms={glossaryForService(REFLECTIVE_PATH)}
      />
      <RelatedServices currentSlug="astrology-tarot" />
      <FinalCta />
    </StepsPath>
  );
}
