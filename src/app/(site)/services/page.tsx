import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { LegacyHashRedirect } from "@/components/ui/LegacyHashRedirect";
import { TermsCallout } from "@/components/sections/ReflectiveBlocks";
import { TestimonialDuo } from "@/components/sections/Testimonials";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  servicesJsonLd,
  servicesItemListJsonLd,
} from "@/lib/structured-data";
import {
  services,
  astrologyServices,
  tarotServices,
  reflectiveIntro,
  servicePath,
  REFLECTIVE_PATH,
  type Service,
} from "@/lib/content/services";
import { getPublishedTestimonials } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Counselling and psychological testing for children & teens, individuals, and couples & families — plus optional reflective guidance through astrology and tarot. Explore how Serene Step can support you, one step at a time.",
  alternates: { canonical: "/services" },
};

// Safety net for a build that ran without a database — see the note in
// src/app/(site)/page.tsx.
export const revalidate = 300;

/**
 * Old deep links into the two-tab version of this page. The two group headings
 * (`#counselling-testing`, `#astrology-tarot`) still exist below, so they're
 * deliberately not in the map — everything else now lives on its own page.
 * See components/ui/LegacyHashRedirect.tsx.
 */
const LEGACY_ANCHORS: Record<string, string> = {
  ...Object.fromEntries(
    services.map((service) => [service.slug, servicePath(service.slug)]),
  ),
  ...Object.fromEntries(
    [...astrologyServices, ...tarotServices].map((service) => [
      service.slug,
      `${REFLECTIVE_PATH}#${service.slug}`,
    ]),
  ),
};

/**
 * The services index.
 *
 * Its whole job is to route people well: a warm orientation, then two clearly
 * separated groups of cards leading into pages that can actually breathe. The
 * detail — every concern, every sub-service, every reading — lives on those
 * pages now, not stacked into two tabs here.
 */
export default async function ServicesPage() {
  const testimonials = await getPublishedTestimonials();
  const voices =
    testimonials.length > 2 ? testimonials.slice(1, 3) : testimonials.slice(0, 2);

  return (
    <StepsPath steps={4}>
      <LegacyHashRedirect map={LEGACY_ANCHORS} />
      {/* One Service / MedicalTherapy node per audience, plus the reflective
          offering — each `@id`'d at its own page. */}
      <JsonLd data={servicesJsonLd()} />
      <JsonLd data={servicesItemListJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/services" }])} />

      <PageHeader
        eyebrow="Our services"
        title={
          <>
            Support for every step, <em>whichever way you begin</em>
          </>
        }
        intro="Two ways we can work together: evidence-based counselling and testing, and — only if it feels meaningful to you — reflective guidance through astrology and tarot. Choose where you'd like to start."
      />

      {/* ── Group 1: counselling & testing ───────────────────────── */}
      <Section id="counselling-testing" spacing="lg">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Counselling &amp; testing</Eyebrow>
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,2.6rem)] leading-[1.12] text-forest">
              Evidence-based support, <em>for three seasons of life</em>
            </h2>
            <p className="mt-4 text-lg leading-[1.8] text-muted">
              The foundation of the practice. Whoever you are and whatever
              you&rsquo;re carrying, there&rsquo;s a gentle place to begin — pick
              the one that sounds most like you.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.06} className="h-full">
                <ServiceCard service={service} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Group 2: astrology & tarot ───────────────────────────── */}
      <WaveEdge className="-mb-px text-sage-mist" />
      <Section id="astrology-tarot" surface="mist" spacing="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <Eyebrow>Astrology &amp; tarot</Eyebrow>
              <h2 className="font-display text-[clamp(1.9rem,3.8vw,2.6rem)] leading-[1.12] text-forest">
                Reflective guidance, <em>not prediction</em>
              </h2>
              <p className="mt-4 text-lg leading-[1.8] text-muted">
                {reflectiveIntro.body[0]}
              </p>
              <Link
                href={REFLECTIVE_PATH}
                className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
              >
                Explore astrology &amp; tarot
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>

            {/* The terms sit beside the invitation, never below it — and stay
                directly under it in the DOM, so a phone meets them first. */}
            <Reveal delay={0.08} className="lg:col-span-5">
              <TermsCallout />
            </Reveal>
          </div>

          {/* A named preview of what's on that page, so the index still tells
              a reader (and a crawler) exactly what's on offer. */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <ReadingList
                label="Astrology readings"
                items={astrologyServices.map((s) => ({ slug: s.slug, title: s.title }))}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <ReadingList
                label="Tarot guidance sessions"
                items={tarotServices.map((s) => ({ slug: s.slug, title: s.title }))}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <TestimonialDuo items={voices} />
      <FinalCta />
    </StepsPath>
  );
}

/* ── An audience, as a card ───────────────────────────────────────── */

function ServiceCard({ service, index }: { service: Service; index: number }) {
  // A handful of the concrete things covered — enough to recognise yourself in,
  // without reprinting the whole page.
  const preview = service.helps.flatMap((group) => group.items).slice(0, 3);

  return (
    <Link
      href={servicePath(service.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-sage-deep/25 bg-cream shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1.5 hover:border-mint-deep/40 hover:shadow-lift"
    >
      <div className="relative overflow-hidden p-3 pb-0">
        <Photo
          image={service.image}
          mask="arch-wide"
          sizes="(max-width: 1024px) 90vw, 30vw"
          className="aspect-[5/4] w-full transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-6 top-6 grid size-10 place-items-center rounded-full bg-paper/90 font-display text-sm italic text-mint-deep shadow-soft backdrop-blur-sm",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted">
          {service.audience}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-forest sm:text-[1.7rem]">
          <span className="link-underline group-hover:bg-[length:100%_1px]">
            {service.title}
          </span>
        </h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{service.intro}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {preview.map((item) => (
            <li
              key={item}
              className="rounded-full border border-sage-deep/25 bg-paper px-3 py-1 text-[0.78rem] text-muted"
            >
              {item}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-2 pt-1 text-sm font-medium text-mint-deep">
          Explore this service
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

/* ── A named preview of the readings on the reflective page ───────── */

function ReadingList({
  label,
  items,
}: {
  label: string;
  items: { slug: string; title: string }[];
}) {
  return (
    <div className="h-full rounded-[1.75rem] border border-sage-deep/25 bg-paper p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-mint-soft text-mint-deep"
        >
          <Sparkles className="size-4" strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-lg text-forest">{label}</h3>
      </div>
      <ul className="mt-5 divide-y divide-sage-deep/20 border-t border-sage-deep/20">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${REFLECTIVE_PATH}#${item.slug}`}
              className="group flex items-center justify-between gap-4 py-3 text-forest transition-colors hover:text-mint-deep"
            >
              <span className="link-underline group-hover:bg-[length:100%_1px]">
                {item.title}
              </span>
              <ArrowRight
                className="size-3.5 shrink-0 text-mint-deep transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
