import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Video, type SiteVideo } from "@/components/ui/Video";
import { Tabs } from "@/components/ui/Tabs";
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
import { img } from "@/lib/images";
import { getPublishedTestimonials } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Counselling and psychological testing for children & teens, individuals, and couples & families — plus optional reflective guidance through astrology and tarot. Explore how Serene Step can support you, one step at a time.",
  alternates: { canonical: "/services" },
};

// Safety net for a build that ran without a database — see the note in
// src/app/(site)/page.tsx.
export const revalidate = 300;

const iconClass = "size-4.5";

// A short, silent loop per audience in place of a still photograph — the
// still photos remain each service's `poster` frame, so a slow connection or
// `prefers-reduced-motion` still shows a graded, on-brand image.
const SERVICE_VIDEOS: Record<Service["slug"], SiteVideo> = {
  "children-teens": {
    src: "/videos/service-children-teens.mp4",
    label: img.teens.alt,
    poster: img.teens.src,
  },
  individuals: {
    src: "/videos/service-individual.mp4",
    label: img.individual.alt,
    poster: img.individual.src,
  },
  "couples-families": {
    src: "/videos/service-couples.mp4",
    label: img.couples.alt,
    poster: img.couples.src,
  },
};

const ASTROLOGY_VIDEO: SiteVideo = {
  src: "/videos/service-astrology-tarot.mp4",
  label: img.astrologyTarot.alt,
  poster: img.astrologyTarot.src,
};

/**
 * Old deep links into earlier versions of this page. `astrology-tarot` is
 * deliberately not in the map — it's now a tab id on this same page (see
 * `Tabs` below), so the browser's own hash handling already gets a reader
 * there. Every audience slug and reading slug now lives on its own page.
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
 * Its whole job is to route people well: a warm orientation, then two tabs —
 * counselling & testing (all three audiences, as cards) and the reflective
 * offering. The full detail — every concern, every sub-service, every
 * reading — still lives on each one's own page; a tab panel here is a
 * preview, not a rewrite.
 */
export default async function ServicesPage() {
  const testimonials = await getPublishedTestimonials();
  const voices =
    testimonials.length > 2 ? testimonials.slice(1, 3) : testimonials.slice(0, 2);

  return (
    <StepsPath steps={2}>
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

      {/* ── Two ways in: counselling & testing, or the reflective offering ── */}
      <Section spacing="lg">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Where would you like to start?</Eyebrow>
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,2.6rem)] leading-[1.12] text-forest">
              Two ways in, <em>at your own pace</em>
            </h2>
            <p className="mt-4 text-lg leading-[1.8] text-muted">
              Evidence-based counselling and testing across three audiences,
              and — only if it feels meaningful to you — reflective guidance
              through astrology and tarot.
            </p>
          </Reveal>

          <Tabs
            label="Services"
            className="mt-10"
            tabs={[
              {
                id: "counselling-testing",
                label: "Counselling & Testing",
                hint: "Children, individuals & families",
                icon: <HeartHandshake className={iconClass} strokeWidth={1.9} />,
                panel: (
                  <CounsellingPanel services={services} videos={SERVICE_VIDEOS} />
                ),
              },
              {
                id: "astrology-tarot",
                label: "Astrology & Tarot",
                hint: "Reflective guidance",
                icon: <Sparkles className={iconClass} strokeWidth={1.9} />,
                panel: (
                  <AstrologyPanel
                    video={ASTROLOGY_VIDEO}
                    astrologyServices={astrologyServices}
                    tarotServices={tarotServices}
                  />
                ),
              },
            ]}
          />
        </Container>
      </Section>

      <TestimonialDuo items={voices} />
      <FinalCta />
    </StepsPath>
  );
}

/* ── Counselling & testing: all three audiences, one tab ─────────── */

function CounsellingPanel({
  services,
  videos,
}: {
  services: Service[];
  videos: Record<Service["slug"], SiteVideo>;
}) {
  return (
    <div className="grid gap-6 pt-10 lg:grid-cols-3">
      {services.map((service, i) => (
        <Reveal key={service.slug} delay={i * 0.06} className="h-full">
          <ServiceCard service={service} video={videos[service.slug]} />
        </Reveal>
      ))}
    </div>
  );
}

function ServiceCard({ service, video }: { service: Service; video: SiteVideo }) {
  // A handful of the concrete things covered — enough to recognise yourself in,
  // without reprinting the whole page.
  const preview = service.helps.flatMap((group) => group.items).slice(0, 3);

  return (
    <Link
      href={servicePath(service.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-sage-deep/25 bg-cream shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1.5 hover:border-mint-deep/40 hover:shadow-lift"
    >
      <div className="p-3 pb-0">
        <Video
          video={video}
          mask="arch-wide"
          className="aspect-[5/4] w-full transition-transform duration-700 ease-soft group-hover:scale-[1.02]"
        />
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

/* ── Astrology & tarot, as a tab panel ────────────────────────────── */

function AstrologyPanel({
  video,
  astrologyServices,
  tarotServices,
}: {
  video: SiteVideo;
  astrologyServices: { slug: string; title: string }[];
  tarotServices: { slug: string; title: string }[];
}) {
  return (
    <div className="pt-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Video video={video} mask="arch-wide" className="aspect-[5/4] w-full shadow-soft" />
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-7">
          <h3 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.15] text-forest">
            Reflective guidance, <em>not prediction</em>
          </h3>
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
      </div>

      {/* The terms sit below the invitation, full-width — the callout is too
          dense to squeeze beside the video without crowding both. */}
      <Reveal delay={0.1} className="mt-8">
        <TermsCallout />
      </Reveal>

      {/* A named preview of what's on that page, so the index still tells
          a reader (and a crawler) exactly what's on offer. */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <ReadingList label="Astrology readings" items={astrologyServices} />
        </Reveal>
        <Reveal delay={0.06}>
          <ReadingList label="Tarot guidance sessions" items={tarotServices} />
        </Reveal>
      </div>
    </div>
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
    <div className="h-full rounded-[1.75rem] border border-sage-deep/25 bg-paper p-6 shadow-soft transition-all duration-500 ease-soft hover:border-mint-deep/30 hover:shadow-lift sm:p-7">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-mint-soft text-mint-deep"
        >
          <Sparkles className="size-4.5" strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-lg text-forest">{label}</h3>
      </div>
      <ul className="mt-5 divide-y divide-sage-deep/20 border-t border-sage-deep/20">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${REFLECTIVE_PATH}#${item.slug}`}
              className="group -mx-2 flex items-center justify-between gap-4 rounded-xl px-2 py-3 text-forest transition-colors duration-300 hover:bg-mint-soft/60 hover:text-mint-deep"
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
