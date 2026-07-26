import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Blocks,
  Check,
  ClipboardCheck,
  Compass,
  Feather,
  HandHeart,
  Heart,
  Handshake,
  Leaf,
  MessagesSquare,
  Milestone,
  Moon,
  Puzzle,
  Sparkles,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealText, RiseIn } from "@/components/ui/RevealText";
import {
  serviceJourney,
  services,
  REFLECTIVE_PATH,
  servicePath,
  type Service,
  type SubServiceGroup,
} from "@/lib/content/services";
import { bookingCta, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The building blocks of a service detail page.
 *
 * Every page is composed from the same vocabulary, but each audience arranges
 * it differently — image side, surfaces, and whether the concerns read as chips
 * or as cards are all decided by the page, not baked in here. See the `variants`
 * map in src/app/(site)/services/[slug]/page.tsx.
 *
 * Copy is never written in this file: it all comes from
 * src/lib/content/services.ts, which is also what feeds the JSON-LD and the
 * llms.txt documents.
 */

/* ── Icons ────────────────────────────────────────────────────────── */

/**
 * Icons are matched by what the sub-service actually is, not by position, so
 * the client can reorder or add items in the content module without a card
 * quietly picking up an unrelated glyph.
 */
const ITEM_ICONS: [RegExp, LucideIcon][] = [
  [/anxiet|stress|worry/i, Wind],
  [/depress|sad/i, Moon],
  [/grief|loss|bereave/i, Feather],
  [/couple|intimac|marriage/i, Heart],
  [/transition|life change/i, Milestone],
  [/relationship management/i, Handshake],
  [/relationship|social|famil/i, Users],
  [/career|roadmap|vocation/i, Compass],
  [/behaviour|behavior/i, Puzzle],
  [/assessment|screening|test|report|portfolio/i, ClipboardCheck],
  [/counselling|session|mental health/i, MessagesSquare],
  [/development/i, Blocks],
];

const GROUP_ICONS: [RegExp, LucideIcon][] = [
  [/early childhood|development/i, Blocks],
  [/career/i, Compass],
  [/child|adolescent|teen/i, MessagesSquare],
];

const iconFor = (label: string, table: [RegExp, LucideIcon][], fallback: LucideIcon) =>
  table.find(([pattern]) => pattern.test(label))?.[1] ?? fallback;

/* ── Shared trimmings ─────────────────────────────────────────────── */

/** Small-caps label with a drawn mint rule, for sub-sections inside a page. */
export function MicroLabel({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em]",
        tone === "light" ? "text-mint-pale" : "text-forest/70",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-px w-8",
          tone === "light" ? "bg-mint" : "bg-mint-deep",
        )}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}

/** The quiet "‹ All services" step back up the tree. Mirrors the breadcrumbs. */
export function BackToServices({ label = "All services" }: { label?: string }) {
  return (
    <Link
      href="/services"
      className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-forest"
    >
      <ArrowLeft
        className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
        aria-hidden="true"
      />
      <span className="link-underline group-hover:bg-[length:100%_1px]">{label}</span>
    </Link>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */

/**
 * The page opener: off-centre, with the audience photograph masked into the
 * signature arch and a tinted panel tilted behind it.
 *
 * The entrance is CSS (`RevealText` / `.rise-in`), never Framer Motion — this
 * h1 is the LCP element, so it has to animate from the first paint rather than
 * waiting for hydration. The photograph is `priority` for the same reason.
 */
export function ServiceHero({
  service,
  imageSide = "right",
  panel = "sand",
  mask = "arch",
}: {
  service: Service;
  imageSide?: "left" | "right";
  panel?: "sand" | "sage" | "mint";
  mask?: "arch" | "arch-wide" | "soft";
}) {
  const left = imageSide === "left";
  const panels = {
    sand: "bg-sand -rotate-2",
    sage: "bg-sage/60 rotate-2",
    mint: "bg-mint-soft -rotate-1",
  } as const;

  return (
    <section className="relative overflow-hidden pb-6 pt-8 sm:pt-12">
      <div
        aria-hidden="true"
        className={cn(
          "wash-drift pointer-events-none absolute -top-32 h-[26rem] w-[26rem] rounded-full bg-mint/10 blur-3xl",
          left ? "-left-40" : "-right-40",
        )}
      />
      <Container className="relative">
        <RiseIn>
          <BackToServices />
        </RiseIn>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className={cn("lg:col-span-7", left && "lg:order-2 lg:col-start-6")}>
            <RiseIn>
              <Eyebrow>{service.audience}</Eyebrow>
            </RiseIn>
            <h1 className="font-display text-[clamp(2.4rem,5.2vw,3.7rem)] leading-[1.05] text-forest">
              <RevealText>{service.title}</RevealText>
            </h1>
            <RiseIn as="p" delay={3} className="mt-6 max-w-[56ch] text-lg leading-[1.8] text-muted">
              {service.intro}
            </RiseIn>
            <RiseIn delay={4} className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Magnetic>
                <Button href={bookingCta.href} variant="primary" size="lg">
                  {bookingCta.label}
                  <ArrowRight
                    className="hidden size-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:inline-block"
                    aria-hidden="true"
                  />
                </Button>
              </Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="link-underline text-[0.95rem] font-medium text-forest"
              >
                Or ask us a question first
              </a>
            </RiseIn>
          </div>

          <div className={cn("mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none lg:col-span-5", left && "lg:order-1 lg:col-start-1")}>
            <div className="relative rise-in rise-delay-2">
              <div
                aria-hidden="true"
                className={cn("absolute -inset-x-5 bottom-8 top-12 rounded-[2.5rem]", panels[panel])}
              />
              <Photo
                image={service.image}
                mask={mask}
                priority
                sizes="(max-width: 1024px) 90vw, 38vw"
                className="relative aspect-[4/5] w-full shadow-lift"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── What you might be carrying ───────────────────────────────────── */

/** The concerns as soft, breathing chips. Reads as a cloud, not a checklist. */
export function ConcernChips({
  concerns,
  tone = "dark",
}: {
  concerns: string[];
  tone?: "dark" | "light";
}) {
  return (
    <ul className="mt-8 flex flex-wrap gap-2.5">
      {concerns.map((concern, i) => (
        <Reveal
          as="li"
          key={concern}
          delay={i * 0.015}
          y={10}
          className={cn(
            "rounded-full border px-4 py-2 text-[0.95rem] leading-snug transition-colors duration-300",
            tone === "light"
              ? "border-mint/30 bg-paper/[0.07] text-mint-pale hover:border-mint hover:text-paper"
              : "border-sage-deep/30 bg-cream text-muted shadow-soft hover:border-mint-deep hover:text-forest",
          )}
        >
          {concern}
        </Reveal>
      ))}
    </ul>
  );
}

/** The same list, set as a quiet two-column card grid with hairline numerals. */
export function ConcernCards({ concerns }: { concerns: string[] }) {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
      {concerns.map((concern, i) => (
        <Reveal
          as="li"
          key={concern}
          delay={i * 0.02}
          y={12}
          className="flex items-start gap-4 rounded-2xl border border-sage-deep/20 bg-cream/70 px-5 py-4 transition-colors duration-300 hover:border-mint-deep/40"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 font-display text-sm italic text-mint-deep"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="leading-relaxed text-muted">{concern}</span>
        </Reveal>
      ))}
    </ul>
  );
}

/* ── How we help — the centrepiece ────────────────────────────────── */

function GroupCard({ group, index }: { group: SubServiceGroup; index: number }) {
  const Icon = iconFor(group.title, GROUP_ICONS, HandHeart);
  return (
    <Reveal
      as="article"
      delay={index * 0.05}
      className="group/card flex h-full flex-col rounded-[1.75rem] border border-sage-deep/25 bg-cream p-6 shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/40 hover:shadow-lift sm:p-7"
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-2xl bg-mint-soft text-mint-deep transition-colors duration-500 group-hover/card:bg-mint group-hover/card:text-forest"
      >
        <Icon className="size-5.5" strokeWidth={1.8} />
      </span>
      <h3 className="mt-5 font-display text-xl leading-snug text-forest sm:text-2xl">
        {group.title}
      </h3>
      <ul className="mt-4 space-y-2.5 border-t border-sage-deep/20 pt-4">
        {group.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 leading-relaxed text-muted">
            <Check
              className="mt-1.5 size-3.5 shrink-0 text-mint-deep"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function ItemCard({ label, index }: { label: string; index: number }) {
  const Icon = iconFor(label, ITEM_ICONS, Leaf);
  return (
    <Reveal
      as="article"
      delay={index * 0.05}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-sage-deep/25 bg-cream p-6 shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/40 hover:shadow-lift sm:p-7"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-mint-soft/60 transition-transform duration-700 ease-soft group-hover/card:scale-125"
      />
      <span
        aria-hidden="true"
        className="relative grid size-12 place-items-center rounded-2xl bg-mint-soft text-mint-deep transition-colors duration-500 group-hover/card:bg-mint group-hover/card:text-forest"
      >
        <Icon className="size-5.5" strokeWidth={1.8} />
      </span>
      <h3 className="relative mt-5 font-display text-xl leading-snug text-forest sm:text-2xl">
        {label}
      </h3>
      <span
        aria-hidden="true"
        className="relative mt-4 block h-px w-10 bg-mint-deep transition-[width] duration-500 ease-soft group-hover/card:w-16"
      />
    </Reveal>
  );
}

/**
 * The work itself.
 *
 * Children & Teens carries three named clusters of sub-services, so each
 * cluster becomes a card with its items listed inside. The other two audiences
 * carry a single flat list whose title is the generic heading — repeating that
 * heading would say nothing, so each item becomes a card of its own instead.
 */
export function HelpsShowcase({
  service,
  columns = 3,
}: {
  service: Service;
  columns?: 2 | 3;
}) {
  const grouped = service.helps.length > 1;
  const items = grouped ? [] : service.helps[0].items;
  const grid = cn(
    "mt-9 grid gap-5 sm:grid-cols-2",
    columns === 3 && "lg:grid-cols-3",
  );

  return (
    <div className={grid}>
      {grouped
        ? service.helps.map((group, i) => (
            <GroupCard key={group.title} group={group} index={i} />
          ))
        : items.map((item, i) => <ItemCard key={item} label={item} index={i} />)}
    </div>
  );
}

/* ── The journey ──────────────────────────────────────────────────── */

/**
 * How a course of work unfolds — the six About values told as five beats, on a
 * drawn wave that echoes the logo mark. Static SVG (no scroll listener): the
 * cards themselves carry the entrance.
 */
export function JourneySection({
  surface = "mist",
  eyebrow = "How the work unfolds",
  title,
}: {
  surface?: "mist" | "sand" | "sage";
  eyebrow?: string;
  title?: React.ReactNode;
}) {
  return (
    <Section surface={surface} spacing="lg" className="overflow-hidden">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
            {title ?? (
              <>
                Five steps, <em>at your pace</em>
              </>
            )}
          </h2>
        </Reveal>

        <div className="relative mt-10">
          {/* The wave threading the steps together — decorative, desktop only. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-6 hidden h-10 w-full text-mint-deep/30 lg:block"
          >
            <path
              d="M0 20 C 100 2 200 38 300 20 C 400 2 500 38 600 20 C 700 2 800 38 900 20 C 950 11 980 15 1000 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {serviceJourney.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.05}>
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-full border border-mint-deep/30 bg-paper font-display text-lg italic text-mint-deep shadow-soft"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg leading-snug text-forest">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-[1.7] text-muted">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ── Closing reassurance ──────────────────────────────────────────── */

/** The practice's closing note, set as a quiet pull-quote rather than a paragraph. */
export function ClosingQuote({ text }: { text: string }) {
  return (
    <Section spacing="lg" className="overflow-hidden">
      <Container size="prose" className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-0 select-none font-display text-[7rem] leading-none text-mint opacity-30 sm:-left-8"
        >
          &ldquo;
        </span>
        <Reveal className="relative">
          <blockquote className="font-display text-[clamp(1.3rem,2.6vw,1.8rem)] italic leading-[1.6] text-forest">
            {text}
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-mint-deep" />
            <span className="text-sm font-semibold text-muted">{site.name}</span>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ── Where to go next ─────────────────────────────────────────────── */

/**
 * The other ways in. Every service page links to its siblings and to the
 * reflective offering, so no page is a dead end for a reader or a crawler.
 */
export function RelatedServices({ currentSlug }: { currentSlug?: string }) {
  const siblings = services.filter((service) => service.slug !== currentSlug);
  const reflective = currentSlug !== "astrology-tarot";

  return (
    <Section surface="paper" spacing="lg">
      <Container>
        <Reveal>
          <Eyebrow>Other ways in</Eyebrow>
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.15] text-forest">
            Looking for <em>something else</em>?
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siblings.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={i * 0.05} className="h-full">
              <NextStepCard
                href={servicePath(service.slug)}
                title={service.title}
                blurb={service.audience}
                icon={iconFor(service.audience, ITEM_ICONS, Users)}
              />
            </Reveal>
          ))}
          {reflective && (
            <Reveal as="li" delay={siblings.length * 0.05} className="h-full">
              <NextStepCard
                href={REFLECTIVE_PATH}
                title="Astrology & Tarot"
                blurb="Optional reflective guidance"
                icon={Sparkles}
              />
            </Reveal>
          )}
        </ul>
      </Container>
    </Section>
  );
}

function NextStepCard({
  href,
  title,
  blurb,
  icon: Icon,
}: {
  href: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full items-center gap-4 rounded-[1.5rem] border border-sage-deep/25 bg-cream px-5 py-5 shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/40 hover:shadow-lift"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-mint-soft text-mint-deep transition-colors duration-500 group-hover:bg-mint group-hover:text-forest"
      >
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg leading-tight text-forest">
          <span className="link-underline group-hover:bg-[length:100%_1px]">{title}</span>
        </span>
        <span className="mt-0.5 block text-sm text-muted">{blurb}</span>
      </span>
      <ArrowRight
        className="size-4 shrink-0 text-mint-deep transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
