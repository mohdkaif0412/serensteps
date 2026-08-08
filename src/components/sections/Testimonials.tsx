import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { PublicTestimonial } from "@/lib/queries";
import { cn } from "@/lib/utils";

/**
 * The testimonial system — quiet social proof for a field built on trust.
 *
 * Four compositions share one visual language (oversized quote glyph, italic
 * display voice, initial-disc + mint-dash attribution):
 *
 *   TestimonialsShowcase  home — one featured voice set large, two layered
 *                         cards beside it
 *   FeaturedTestimonial   about — a single set-piece quote band
 *   TestimonialDuo        services — two relevant voices on layered paper
 *   TestimonialWhisper    contact — one small reassuring card by the form
 *
 * All render nothing when there are no published testimonials.
 */

/* Shared attribution: a soft initial disc instead of a photo — warm,
   and deliberately anonymous. */
function Attribution({
  item,
  tone = "dark",
}: {
  item: PublicTestimonial;
  tone?: "dark" | "light";
}) {
  return (
    <figcaption className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full font-display text-base italic",
          tone === "light"
            ? "bg-paper/15 text-mint"
            : "border border-mint/50 bg-mint-soft/60 text-mint-deep",
        )}
      >
        {item.name.charAt(0)}
      </span>
      <span className="text-sm leading-tight">
        <span
          className={cn(
            "block font-semibold",
            tone === "light" ? "text-paper" : "text-forest",
          )}
        >
          {item.name}
        </span>
        {item.role && (
          <span className={tone === "light" ? "text-sage/80" : "text-muted"}>
            {item.role}
          </span>
        )}
      </span>
    </figcaption>
  );
}

/* The recurring motif: an oversized serif open-quote, mint, sitting behind
   or beside the words. */
function QuoteGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none font-display leading-none text-mint",
        className,
      )}
    >
      &ldquo;
    </span>
  );
}

/* A small layered voice card — cream/sage-mist paper, gentle tilt. */
function VoiceCard({
  item,
  className,
}: {
  item: PublicTestimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative rounded-[1.5rem] border border-sage-deep/20 p-6 pt-7 shadow-soft",
        className,
      )}
    >
      <QuoteGlyph className="absolute -top-4 left-5 text-5xl" />
      <blockquote className="font-display text-[1.05rem] italic leading-[1.65] text-forest">
        {item.quote}
      </blockquote>
      <div className="mt-4">
        <Attribution item={item} />
      </div>
    </figure>
  );
}

/* ── Home: the prominent moment ─────────────────────────────────── */

export function TestimonialsShowcase({ items }: { items: PublicTestimonial[] }) {
  if (!items.length) return null;

  const [featured, ...rest] = items;
  const side = rest.slice(0, 2);

  return (
    <Section surface="sand" spacing="lg" className="overflow-hidden">
      <Container className="relative">
        {/* Watermark glyph anchored to the content column, behind everything */}
        <QuoteGlyph className="absolute -top-10 right-0 z-0 text-[clamp(8rem,18vw,15rem)] opacity-25" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* The featured voice, set like an editorial pull-quote */}
          <figure className={cn(side.length ? "lg:col-span-7" : "lg:col-span-9")}>
            <Reveal>
              <Eyebrow>In their words</Eyebrow>
              <blockquote className="mt-2 font-display text-[clamp(1.45rem,2.9vw,2.05rem)] italic leading-[1.55] text-forest">
                {featured.quote}
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-mint-deep" />
                <Attribution item={featured} />
              </div>
            </Reveal>
          </figure>

          {/* Two quieter voices on layered paper beside it */}
          {side.length > 0 && (
            <div className="space-y-5 lg:col-span-4 lg:col-start-9 lg:self-center">
              {side.map((item, i) => (
                <Reveal key={item.name + i} delay={0.08 + i * 0.06}>
                  <VoiceCard
                    item={item}
                    className={cn(
                      i % 2 === 0
                        ? "-rotate-1 bg-cream"
                        : "rotate-1 bg-sage-mist lg:translate-x-4",
                    )}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

/* ── About: one well-set voice reinforcing trust ────────────────── */

export function FeaturedTestimonial({ item }: { item?: PublicTestimonial }) {
  if (!item) return null;

  return (
    <Section surface="sand" spacing="md" className="overflow-hidden">
      <Container size="prose" className="relative">
        <QuoteGlyph className="absolute -top-8 left-0 z-0 text-[7rem] opacity-30 sm:-left-10" />
        <Reveal className="relative z-10">
          <Eyebrow>In their words</Eyebrow>
          <blockquote className="mt-2 font-display text-[clamp(1.35rem,2.6vw,1.8rem)] italic leading-[1.6] text-forest">
            {item.quote}
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-mint-deep" />
            <Attribution item={item} />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ── Services: a voice or two from people who've been here ──────── */

export function TestimonialDuo({ items }: { items: PublicTestimonial[] }) {
  if (!items.length) return null;
  const pair = items.slice(0, 2);

  return (
    <Section surface="sage" spacing="md">
      <Container>
        <Reveal>
          <Eyebrow>In their words</Eyebrow>
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.15] text-forest">
            Small steps, <em>real change</em>
          </h2>
        </Reveal>
        <div
          className={cn(
            "mt-8 grid gap-6",
            pair.length > 1 && "sm:grid-cols-2 sm:gap-8",
          )}
        >
          {pair.map((item, i) => (
            <Reveal key={item.name + i} delay={i * 0.07} className="h-full">
              <VoiceCard
                item={item}
                className={cn(
                  "h-full",
                  i % 2 === 0
                    ? "-rotate-[0.5deg] bg-cream"
                    : "rotate-[0.5deg] bg-paper sm:translate-y-4",
                )}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ── Contact: one gentle reassurance beside the form ────────────── */

export function TestimonialWhisper({ item }: { item?: PublicTestimonial }) {
  if (!item) return null;

  return (
    <figure className="relative mt-8 rounded-[1.5rem] border border-mint/30 bg-mint-soft/40 p-6 pt-7">
      <QuoteGlyph className="absolute -top-4 left-5 text-5xl" />
      <blockquote className="font-display text-[1.02rem] italic leading-[1.65] text-forest">
        {item.quote}
      </blockquote>
      <div className="mt-4">
        <Attribution item={item} />
      </div>
    </figure>
  );
}
