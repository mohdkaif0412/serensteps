import type { Metadata } from "next";
import { Check, ShieldAlert, Sparkles, Compass } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { TestimonialDuo } from "@/components/sections/Testimonials";
import {
  services,
  astrologyServices,
  tarotServices,
  tarotIntro,
  reflectiveIntro,
  reflectiveTerms,
  whatWeBelieve,
  type Service,
  type AstrologyService,
  type TarotService,
} from "@/lib/content/services";
import { getPublishedTestimonials } from "@/lib/queries";
import { bookingCta, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Counselling and psychological testing for children & teens, individuals, and couples & families — plus optional reflective guidance through astrology and tarot. Explore how Serene Step can support you, one step at a time.",
};

// Each audience gets its own surface so consecutive sections never share a shape.
const surfaces = ["paper", "mist", "paper"] as const;

export default async function ServicesPage() {
  const testimonials = await getPublishedTestimonials();
  // Voices that speak to these audiences (couple + parent when available).
  const voices =
    testimonials.length > 2 ? testimonials.slice(1, 3) : testimonials.slice(0, 2);

  const tabs: TabItem[] = [
    {
      id: "counselling-testing",
      label: "Counselling & Testing",
      hint: "Evidence-based psychological support",
      anchors: services.map((service) => service.slug),
      panel: (
        <>
          <div>
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
          <TestimonialDuo items={voices} />
        </>
      ),
    },
    {
      id: "astrology-tarot",
      label: "Astrology & Tarot",
      hint: "Optional reflective guidance",
      anchors: [
        ...astrologyServices.map((service) => service.slug),
        ...tarotServices.map((service) => service.slug),
      ],
      panel: <ReflectivePanel />,
    },
  ];

  return (
    <StepsPath steps={4}>
      <PageHeader
        eyebrow="Our services"
        title={
          <>
            Support for every step, <em>whichever way you begin</em>
          </>
        }
        intro="Two ways we can work together: evidence-based counselling and testing, and — only if it feels meaningful to you — reflective guidance through astrology and tarot. Choose where you'd like to start."
      />

      <Section spacing="sm">
        <Container>
          <Tabs tabs={tabs} label="Choose a type of service" />
        </Container>
      </Section>

      <FinalCta />
    </StepsPath>
  );
}

/* ── Tab 1: one audience per band ─────────────────────────────────── */

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
  // Only Children & Teens has named clusters of sub-services; the other two are
  // a single flat list, which shouldn't gain a redundant heading.
  const grouped = service.helps.length > 1;

  return (
    <Section id={service.slug} surface={surface} spacing="lg" className="overflow-hidden">
      <Container className="relative">
        {/* Oversized watermark numeral — anchored to the content column (never
            the viewport edge) so the glyph is always fully visible; scales
            down fluidly on small screens. Sits behind the content. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-8 z-0 select-none font-display text-[clamp(5.5rem,13vw,11rem)] italic leading-none text-sage-deep/15 sm:-top-12",
            reversed ? "left-0" : "right-0",
          )}
        >
          0{index + 1}
        </span>
        <div className="relative z-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* These columns are long now, so the image rides along on desktop. */}
          <Reveal
            className={cn(
              "mx-auto w-full max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none",
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
              reversed ? "lg:order-1 lg:col-span-6" : "lg:col-span-6 lg:col-start-7",
            )}
          >
            <Reveal>
              <Eyebrow>{service.audience}</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.1] text-forest">
                {service.title}
              </h2>
              <p className="mt-5 max-w-[58ch] text-lg leading-[1.8] text-muted">
                {service.intro}
              </p>
            </Reveal>

            {/* What people arrive carrying — quiet dots, not ticks: these
                aren't achievements. */}
            <Reveal delay={0.06}>
              <SubHeading>Common concerns</SubHeading>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {service.concerns.map((concern) => (
                  <li
                    key={concern}
                    className="flex items-start gap-2.5 leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-sage-deep"
                    />
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* …and the work itself */}
            <Reveal delay={0.1}>
              <SubHeading>What we help with</SubHeading>
              <div className={cn("mt-4", grouped && "space-y-5")}>
                {service.helps.map((group) => (
                  <div key={group.title}>
                    {grouped && (
                      <h3 className="font-display text-lg text-forest">
                        {group.title}
                      </h3>
                    )}
                    <ul
                      className={cn(
                        "grid gap-x-8 gap-y-2.5 sm:grid-cols-2",
                        grouped && "mt-2",
                      )}
                    >
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 leading-relaxed text-muted"
                        >
                          <Check
                            className="mt-1.5 size-3.5 shrink-0 text-mint-deep"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-7 border-l-2 border-mint-deep/50 pl-5 text-[1.02rem] italic leading-[1.75] text-forest-soft">
                {service.closing}
              </p>
              <div className="mt-7">
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

/** Small-caps label with a drawn mint rule, used inside a service block. */
function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-7 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-forest/70">
      <span className="inline-block h-px w-8 bg-mint-deep" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ── Tab 2: astrology & tarot ─────────────────────────────────────── */

function ReflectivePanel() {
  return (
    <>
      {/* Framing first — what this is, and just as importantly what it isn't. */}
      <Section spacing="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-6">
              <Eyebrow>A unique integrative approach</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.12] text-forest">
                Reflective guidance, <em>not prediction</em>
              </h2>
              <div className="mt-5 max-w-[58ch] space-y-4 text-lg leading-[1.8] text-muted">
                {reflectiveIntro.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {/* The terms sit here — beside the intro, above every service —
                because for this offering the framing *is* the offering. */}
            <Reveal delay={0.08} className="lg:col-span-6">
              <TermsCallout />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Astrology — three readings as an editorial sequence */}
      <Section surface="mist" spacing="lg">
        <Container>
          <Reveal>
            <Eyebrow>Astrology services</Eyebrow>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
              Three ways to <em>read the map</em>
            </h2>
          </Reveal>
          <div className="mt-9 space-y-6">
            {astrologyServices.map((service, i) => (
              <AstrologyCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Tarot — five focus areas */}
      <Section spacing="lg">
        <Container>
          <Reveal>
            <Eyebrow>Tarot guidance sessions</Eyebrow>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
              A mirror, <em>not a forecast</em>
            </h2>
            <p className="mt-4 max-w-[62ch] text-lg leading-[1.8] text-muted">
              {tarotIntro}
            </p>
          </Reveal>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tarotServices.map((service, i) => (
              <TarotCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* What we believe — the closing note, on the grounding dark band */}
      <section className="on-forest relative">
        <div className="bg-forest py-12 sm:py-16">
          <Container size="prose">
            <Reveal>
              <Eyebrow tone="light">{whatWeBelieve.eyebrow}</Eyebrow>
              <p className="font-display text-[clamp(1.3rem,2.6vw,1.75rem)] leading-[1.55] text-paper">
                {whatWeBelieve.body}
              </p>
              <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button href={bookingCta.href} variant="accent">
                  Book a session
                </Button>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-[0.95rem] font-medium text-mint-pale"
                >
                  Or ask us a question first
                </a>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>
    </>
  );
}

/**
 * The disclaimer, styled as a deliberate feature of the page rather than fine
 * print. It stays open (no accordion), sits above every service, and uses the
 * heaviest border on the site.
 */
function TermsCallout() {
  return (
    <aside
      aria-labelledby="reflective-terms-heading"
      className="rounded-[1.75rem] border-2 border-mint-deep/30 bg-mint-soft p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-mint">
          <ShieldAlert className="size-5" strokeWidth={1.9} aria-hidden="true" />
        </span>
        <h3
          id="reflective-terms-heading"
          className="font-display text-xl text-forest sm:text-2xl"
        >
          Please read this first
        </h3>
      </div>
      <ul className="mt-5 space-y-3.5">
        {reflectiveTerms.map((term) => (
          <li key={term.slice(0, 32)} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-mint-deep"
            />
            <span className="leading-[1.7] text-forest">{term}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function AstrologyCard({
  service,
  index,
}: {
  service: AstrologyService;
  index: number;
}) {
  return (
    <Reveal as="article" id={service.slug} delay={index * 0.05} className="scroll-mt-28">
      <div className="rounded-[1.75rem] border border-sage-deep/25 bg-cream p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-mint-soft text-mint-deep"
          >
            <Compass className="size-5" strokeWidth={1.9} />
          </span>
          <div>
            <p aria-hidden="true" className="font-display text-sm italic text-mint-deep">
              0{index + 1}
            </p>
            <h3 className="font-display text-2xl leading-tight text-forest">
              {service.title}
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MicroLabel>What it explores</MicroLabel>
            <ul className="mt-3 space-y-2">
              {service.explores.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 leading-relaxed text-muted"
                >
                  <Check
                    className="mt-1.5 size-3.5 shrink-0 text-mint-deep"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <MicroLabel>Psychology collaboration</MicroLabel>
            <p className="mt-3 leading-[1.75] text-muted">{service.collaboration}</p>
            <p className="mt-5 rounded-xl bg-mint-soft/70 px-4 py-3 leading-[1.7] text-forest">
              <span className="font-semibold">Outcome — </span>
              {service.outcome}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TarotCard({ service, index }: { service: TarotService; index: number }) {
  return (
    <Reveal
      as="article"
      id={service.slug}
      delay={index * 0.04}
      className="h-full scroll-mt-28"
    >
      <div className="flex h-full flex-col rounded-[1.5rem] border border-sage-deep/25 bg-cream p-6 shadow-soft">
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full bg-mint-soft text-mint-deep"
        >
          <Sparkles className="size-4.5" strokeWidth={1.9} />
        </span>
        <h3 className="mt-4 font-display text-xl leading-tight text-forest">
          {service.title}
        </h3>
        <p className="mt-3 leading-[1.7] text-muted">
          <span className="font-semibold text-forest">Focus: </span>
          {service.focus}
        </p>
        <p className="mt-3 border-t border-sage-deep/20 pt-3 text-[0.95rem] leading-[1.7] text-muted">
          <span className="font-semibold text-forest">
            Psychological integration:{" "}
          </span>
          {service.integration}
        </p>
      </div>
    </Reveal>
  );
}

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-forest/70">
      {children}
    </p>
  );
}
