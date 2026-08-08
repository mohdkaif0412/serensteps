import { Check, Compass, ShieldAlert, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/sections/ServiceBlocks";
import {
  reflectiveTerms,
  whatWeBelieve,
  type AstrologyService,
  type TarotService,
} from "@/lib/content/services";
import { bookingCta, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The astrology & tarot vocabulary, shared by the /services index (where the
 * terms and a preview appear) and the /services/astrology-tarot page.
 *
 * The framing is the offering here, so the disclaimer is a designed feature of
 * the page rather than fine print: heaviest border on the site, always open,
 * always above the services it qualifies.
 */

/* ── The terms ────────────────────────────────────────────────────── */

export function TermsCallout({
  className,
  /** Unique per instance — the astrology page shows the callout twice. */
  headingId = "reflective-terms-heading",
}: {
  className?: string;
  headingId?: string;
}) {
  return (
    <aside
      aria-labelledby={headingId}
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-mint-deep/25 bg-mint-soft shadow-lift",
        className,
      )}
    >
      {/* A dark header band makes this read as a notice, not just another card */}
      <div className="on-forest relative flex items-center gap-4 overflow-hidden bg-forest px-6 py-5 sm:px-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-10 size-28 rounded-full bg-mint/20 blur-2xl"
        />
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-mint text-forest shadow-soft">
          <ShieldAlert className="size-5" strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="relative">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mint-pale">
            Important
          </p>
          <h2 id={headingId} className="mt-0.5 font-display text-xl text-paper sm:text-2xl">
            Please read this first
          </h2>
        </div>
      </div>

      <ul className="space-y-4 p-6 sm:p-8">
        {reflectiveTerms.map((term) => (
          <li key={term.slice(0, 32)} className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint-deep/15 text-mint-deep"
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
            <span className="leading-[1.7] text-forest">{term}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ── One astrology reading ────────────────────────────────────────── */

/**
 * A reading, set as three labelled parts rather than a paragraph blob: what it
 * explores, how it is paired with psychological concepts, and what you leave
 * with. The outcome is pulled out as its own tile — it's the part a reader is
 * actually scanning for.
 */
export function AstrologyBlock({
  service,
  index,
}: {
  service: AstrologyService;
  index: number;
}) {
  const reversed = index % 2 === 1;
  return (
    <Reveal as="article" id={service.slug} delay={0.04} className="scroll-mt-28">
      <div className="overflow-hidden rounded-[2rem] border border-sage-deep/25 bg-cream shadow-soft">
        <div className="grid lg:grid-cols-12">
          {/* The title plate — a tinted column that swaps sides down the page. */}
          <div
            className={cn(
              "relative flex flex-col justify-between gap-6 bg-sage-mist p-6 sm:p-8 lg:col-span-4",
              reversed && "lg:order-2",
            )}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-mint/10"
            />
            <div className="relative">
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-forest text-mint"
              >
                <Compass className="size-5" strokeWidth={1.9} />
              </span>
              <p aria-hidden="true" className="mt-5 font-display text-sm italic text-mint-deep">
                Reading {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-[clamp(1.5rem,2.8vw,2rem)] leading-tight text-forest">
                {service.title}
              </h3>
            </div>
            <div className="relative">
              <MicroLabel>You leave with</MicroLabel>
              <p className="mt-2.5 leading-[1.7] text-forest">{service.outcome}</p>
            </div>
          </div>

          <div className="grid gap-7 p-6 sm:p-8 lg:col-span-8 lg:grid-cols-2 lg:gap-9">
            <div>
              <MicroLabel>What it explores</MicroLabel>
              <ul className="mt-3.5 space-y-2.5">
                {service.explores.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 leading-relaxed text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-mint-deep"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <MicroLabel>Psychology collaboration</MicroLabel>
              <p className="mt-3.5 leading-[1.75] text-muted">{service.collaboration}</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── One tarot session ────────────────────────────────────────────── */

export function TarotCard({
  service,
  index,
}: {
  service: TarotService;
  index: number;
}) {
  return (
    <Reveal
      as="article"
      id={service.slug}
      delay={index * 0.04}
      className="h-full scroll-mt-28"
    >
      <div className="group/card relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-sage-deep/25 bg-cream p-6 shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/40 hover:shadow-lift">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-mint-soft/70 transition-transform duration-700 ease-soft group-hover/card:scale-125"
        />
        <span
          aria-hidden="true"
          className="relative grid size-10 place-items-center rounded-full bg-mint-soft text-mint-deep transition-colors duration-500 group-hover/card:bg-mint group-hover/card:text-forest"
        >
          <Sparkles className="size-4.5" strokeWidth={1.9} />
        </span>
        <h3 className="relative mt-4 font-display text-xl leading-tight text-forest">
          {service.title}
        </h3>
        <div className="relative mt-4">
          <MicroLabel>Focus</MicroLabel>
          <p className="mt-2 leading-[1.7] text-muted">{service.focus}</p>
        </div>
        <div className="relative mt-4 border-t border-sage-deep/20 pt-4">
          <MicroLabel>Psychological integration</MicroLabel>
          <p className="mt-2 text-[0.95rem] leading-[1.7] text-muted">
            {service.integration}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ── The closing belief, on the grounding dark band ───────────────── */

export function WhatWeBelieveBand() {
  return (
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
  );
}
