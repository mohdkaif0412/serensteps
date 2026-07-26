import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { StepsPath } from "@/components/ui/StepsPath";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { FinalCta } from "@/components/sections/FinalCta";
import { TestimonialDuo } from "@/components/sections/Testimonials";
import {
  ServiceHero,
  ConcernChips,
  ConcernCards,
  HelpsShowcase,
  JourneySection,
  ClosingQuote,
  RelatedServices,
} from "@/components/sections/ServiceBlocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/structured-data";
import {
  getService,
  serviceSlugs,
  servicePath,
  type Service,
} from "@/lib/content/services";
import { getPublishedTestimonials } from "@/lib/queries";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

// Copy is static, but the testimonials underneath come from the database — the
// same short revalidate every content page carries, so a database-less build
// self-heals. See src/lib/db.ts.
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

/** ~155 characters, cut at a word boundary — a description, not a truncation. */
function summarise(text: string, limit = 155) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const title = `${service.title} Counselling`;
  const description = summarise(service.intro);
  const url = servicePath(service.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: site.name },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ── Per-audience composition ─────────────────────────────────────── */

/**
 * Each audience gets its own arrangement, so the three pages don't read as one
 * template with the words swapped: the photograph changes side, the concerns
 * are chips on one page and cards on another, the surfaces alternate, and
 * Individuals leads with the work rather than with what's wrong.
 */
type Variant = {
  hero: {
    imageSide: "left" | "right";
    panel: "sand" | "sage" | "mint";
    mask: "arch" | "arch-wide";
  };
  concerns: {
    style: "chips" | "cards";
    surface: "paper" | "mist" | "sand" | "forest";
    eyebrow: string;
    heading: ReactNode;
    lede: string;
  };
  helps: {
    surface: "paper" | "mist" | "sand" | "sage";
    columns: 2 | 3;
    eyebrow: string;
    heading: ReactNode;
    lede: string;
  };
  /** Which comes first under the hero. */
  order: ("concerns" | "helps")[];
  journeySurface: "mist" | "sand" | "sage";
};

const variants: Record<Service["slug"], Variant> = {
  "children-teens": {
    hero: { imageSide: "right", panel: "sand", mask: "arch" },
    concerns: {
      style: "chips",
      surface: "paper",
      eyebrow: "What they might be carrying",
      heading: (
        <>
          Any of this <em>sound familiar</em>?
        </>
      ),
      lede: "Young people rarely arrive with the words for it. These are the things that tend to be underneath — and none of them needs to be a crisis to be worth talking about.",
    },
    helps: {
      surface: "mist",
      columns: 3,
      eyebrow: "How we help",
      heading: (
        <>
          Three kinds of work, <em>one young person</em>
        </>
      ),
      lede: "Assessment, career direction, and counselling — used together or on their own, always at a pace that suits the age and the moment.",
    },
    order: ["concerns", "helps"],
    journeySurface: "sand",
  },
  individuals: {
    hero: { imageSide: "left", panel: "mint", mask: "arch-wide" },
    // Adults mostly know what's wrong; what they want to know is what the work
    // actually is. So this page opens with the work and follows with the list.
    helps: {
      surface: "paper",
      columns: 3,
      eyebrow: "How we help",
      heading: (
        <>
          What we <em>work on together</em>
        </>
      ),
      lede: "Sessions are shaped around you rather than a protocol, drawing on evidence-based psychological approaches.",
    },
    concerns: {
      style: "cards",
      surface: "mist",
      eyebrow: "What you might be carrying",
      heading: (
        <>
          You don&rsquo;t need a reason <em>good enough</em>
        </>
      ),
      lede: "People arrive with all of these, and often with several at once. Recognising yourself in one of them is reason enough to start.",
    },
    order: ["helps", "concerns"],
    journeySurface: "sand",
  },
  "couples-families": {
    hero: { imageSide: "right", panel: "sage", mask: "arch" },
    // The heaviest list on the site (twelve items) — set on the forest band, it
    // reads as one held moment instead of a wall.
    concerns: {
      style: "chips",
      surface: "forest",
      eyebrow: "What brings people in",
      heading: (
        <>
          The patterns <em>underneath the argument</em>
        </>
      ),
      lede: "Almost every couple and family arrives with some version of these. Naming the pattern is usually what lowers the temperature — more than winning any single conversation does.",
    },
    helps: {
      surface: "mist",
      columns: 3,
      eyebrow: "How we help",
      heading: (
        <>
          The relationship <em>is the client</em>
        </>
      ),
      lede: "The aim isn't to establish who was right. It's to make the pattern visible to everyone in the room, and to build a way back to each other after a rupture.",
    },
    order: ["concerns", "helps"],
    journeySurface: "sand",
  },
};

/* ── The page ─────────────────────────────────────────────────────── */

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const variant = variants[service.slug];
  const testimonials = await getPublishedTestimonials();
  const voices =
    testimonials.length > 2 ? testimonials.slice(1, 3) : testimonials.slice(0, 2);

  const blocks: Record<"concerns" | "helps", ReactNode> = {
    concerns: <ConcernsBand key="concerns" service={service} variant={variant} />,
    helps: <HelpsBand key="helps" service={service} variant={variant} />,
  };

  return (
    <StepsPath steps={5}>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Services", path: "/services" },
          { name: service.title, path: servicePath(service.slug) },
        ])}
      />

      <ServiceHero service={service} {...variant.hero} />

      {variant.order.map((key) => blocks[key])}

      <JourneySection surface={variant.journeySurface} />

      <ClosingQuote text={service.closing} />

      <TestimonialDuo items={voices} />
      <RelatedServices currentSlug={service.slug} />
      <FinalCta />
    </StepsPath>
  );
}

/* ── Bands ────────────────────────────────────────────────────────── */

function ConcernsBand({ service, variant }: { service: Service; variant: Variant }) {
  const { style, surface, eyebrow, heading, lede } = variant.concerns;
  const onForest = surface === "forest";

  return (
    <>
      {onForest && <WaveEdge className="-mb-px text-forest" />}
      <Section
        surface={onForest ? "forest" : surface}
        spacing="lg"
        className={cn(onForest && "on-forest")}
      >
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow tone={onForest ? "light" : "dark"}>{eyebrow}</Eyebrow>
            <h2
              className={cn(
                "font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15]",
                onForest ? "text-paper" : "text-forest",
              )}
            >
              {heading}
            </h2>
            <p
              className={cn(
                "mt-4 text-lg leading-[1.8]",
                onForest ? "text-sage/85" : "text-muted",
              )}
            >
              {lede}
            </p>
          </Reveal>

          {style === "chips" ? (
            <ConcernChips
              concerns={service.concerns}
              tone={onForest ? "light" : "dark"}
            />
          ) : (
            <ConcernCards concerns={service.concerns} />
          )}
        </Container>
      </Section>
      {onForest && <WaveEdge className="-mt-px text-forest" flip />}
    </>
  );
}

function HelpsBand({ service, variant }: { service: Service; variant: Variant }) {
  const { surface, columns, eyebrow, heading, lede } = variant.helps;
  return (
    <Section surface={surface} spacing="lg">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
            {heading}
          </h2>
          <p className="mt-4 text-lg leading-[1.8] text-muted">{lede}</p>
        </Reveal>
        <HelpsShowcase service={service} columns={columns} />
      </Container>
    </Section>
  );
}
