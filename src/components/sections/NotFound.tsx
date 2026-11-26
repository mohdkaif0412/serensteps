import Link from "next/link";
import {
  ArrowRight,
  House,
  Leaf,
  HeartHandshake,
  MessageCircle,
  Newspaper,
  CalendarPlus,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealText } from "@/components/ui/RevealText";
import { MissedPath } from "@/components/sections/MissedPath";
import {
  notFoundPage as copy,
  type NotFoundSuggestionIcon,
} from "@/lib/content/not-found";
import { bookingCta, site } from "@/lib/site";

const icons: Record<NotFoundSuggestionIcon, LucideIcon> = {
  services: HeartHandshake,
  resources: Leaf,
  blog: Newspaper,
  contact: MessageCircle,
};

/* ------------------------------------------------------------------ */
/* The "lost face" — the brand's wave-of-faces character standing in   */
/* for the 0 in 404, a little puzzled and gently bobbing. Eyes blink.  */
/* Decorative only. Motion is CSS (see .lost-* in globals.css) and is   */
/* collapsed by the global reduced-motion floor.                       */
/* ------------------------------------------------------------------ */
function LostFace() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className="lost-bob mx-[0.04em] inline-block h-[0.74em] w-[0.74em] shrink-0 drop-shadow-[0_18px_30px_rgba(15,44,37,0.18)]"
    >
      {/* Mint fill is a large element, so pure brand mint is right here. */}
      <circle cx="50" cy="50" r="48" fill="var(--color-mint)" />
      <circle cx="50" cy="50" r="48" fill="url(#lost-face-sheen)" />
      <defs>
        <radialGradient id="lost-face-sheen" cx="0.32" cy="0.28" r="0.75">
          <stop offset="0" stopColor="white" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* One brow raised — the "hm, where am I?" look. */}
      <path
        d="M27 33 Q34 28 41 31"
        stroke="var(--color-forest)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M59 29 Q66 24 73 28"
        stroke="var(--color-forest)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <g className="lost-blink">
        <circle cx="35" cy="44" r="5.2" fill="var(--color-forest)" />
        <circle cx="66" cy="42" r="5.2" fill="var(--color-forest)" />
      </g>
      {/* A small, wondering "o". */}
      <ellipse
        cx="52"
        cy="68"
        rx="7"
        ry="8.5"
        fill="none"
        stroke="var(--color-forest)"
        strokeWidth="3.4"
      />
      <circle cx="22" cy="60" r="5" fill="var(--color-forest)" opacity="0.08" />
      <circle cx="80" cy="58" r="5" fill="var(--color-forest)" opacity="0.08" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The steps path trailing off: the brand's sine wave of faces walks    */
/* confidently for a while, then dissolves into a fading dashed line    */
/* that ends in a question mark. Same construction as WaveMark.        */
/* ------------------------------------------------------------------ */
const W = 480;
const H = 96;
const MID = H / 2;
const AMP = 22;
const PERIODS = 3;
const SPLIT = 0.6; // where the sure-footed path starts to fade
const END = 0.9; // where the trail runs out

const yAt = (t: number) => MID - AMP * Math.sin(t * Math.PI * 2 * PERIODS);

function pathBetween(from: number, to: number, samples = 90) {
  return Array.from({ length: samples + 1 }, (_, i) => {
    const t = from + ((to - from) * i) / samples;
    return `${i === 0 ? "M" : "L"}${(t * W).toFixed(1)} ${yAt(t).toFixed(1)}`;
  }).join(" ");
}

const SOLID = pathBetween(0, SPLIT);
const TRAIL = pathBetween(SPLIT, END, 60);
const FACES = Array.from({ length: PERIODS * 2 }, (_, i) => {
  const t = (0.25 + i * 0.5) / PERIODS;
  return { x: t * W, y: yAt(t), crest: i % 2 === 0, t };
}).filter((face) => face.t < SPLIT);

function TrailingPath() {
  const qx = END * W + 22;
  const qy = yAt(END);
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W + 40} ${H}`}
      className="mx-auto block h-14 w-full max-w-md text-mint-deep sm:h-16"
      fill="none"
    >
      <defs>
        <linearGradient
          id="trail-fade"
          gradientUnits="userSpaceOnUse"
          x1={SPLIT * W}
          x2={END * W}
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d={SOLID}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="mark-draw"
        pathLength={1}
      />
      <path
        d={TRAIL}
        stroke="url(#trail-fade)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="2 9"
        className="trail-drift"
      />
      {FACES.map((face, i) => (
        <g
          key={i}
          className="face-wake"
          style={{ ["--wake-delay" as string]: `${0.25 + face.t * 1.2}s` }}
        >
          <circle cx={face.x} cy={face.y} r="11" fill="var(--color-paper)" />
          <circle cx={face.x - 4} cy={face.y - 3} r="1.8" fill="currentColor" />
          <circle cx={face.x + 4} cy={face.y - 3} r="1.8" fill="currentColor" />
          <path
            d={
              face.crest
                ? `M${face.x - 5} ${face.y + 2.5}C${face.x - 2.5} ${face.y + 6.5} ${face.x + 2.5} ${face.y + 6.5} ${face.x + 5} ${face.y + 2.5}`
                : `M${face.x - 5} ${face.y + 4}C${face.x - 2.5} ${face.y + 5.5} ${face.x + 2.5} ${face.y + 5.5} ${face.x + 5} ${face.y + 4}`
            }
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}
      <text
        x={qx}
        y={qy + 9}
        textAnchor="middle"
        fontSize="26"
        fontWeight="600"
        fill="currentColor"
        opacity="0.55"
        className="lost-bob"
      >
        ?
      </text>
    </svg>
  );
}

/**
 * The 404 page body. Server-rendered; everything above the fold animates in
 * CSS from first paint (never from opacity 0), per the LCP rule in AGENTS.md.
 */
export function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient washes — soft mint and sage light behind the numerals. */}
      <div
        aria-hidden="true"
        className="wash-drift pointer-events-none absolute -top-32 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-mint-soft/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="wash-drift-slow pointer-events-none absolute -right-40 bottom-0 -z-10 size-[28rem] rounded-full bg-sage/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="wash-drift pointer-events-none absolute -left-48 top-1/3 -z-10 size-[24rem] rounded-full bg-sand/80 blur-3xl"
      />

      <Container className="flex flex-col items-center pt-12 pb-16 text-center sm:pt-16 sm:pb-24">
        {/* 4 · face · 4 */}
        <p
          aria-hidden="true"
          className="rise-in flex select-none items-center justify-center font-display text-[clamp(6.5rem,24vw,13.5rem)] leading-[0.9] font-semibold tracking-[-0.06em] text-forest"
        >
          <span>4</span>
          <LostFace />
          <span>4</span>
        </p>

        <div className="rise-in rise-delay-1 -mt-1 w-full">
          <TrailingPath />
        </div>

        <Eyebrow className="rise-in rise-delay-2 mt-8">{copy.eyebrow}</Eyebrow>

        <h1 className="max-w-2xl text-4xl leading-[1.08] text-forest sm:text-5xl md:text-[3.4rem]">
          <RevealText>
            {copy.title.lead}{" "}
            <em className="text-forest-soft">{copy.title.emphasis}</em>
          </RevealText>
        </h1>

        <p className="rise-in rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {copy.intro}
        </p>

        <div className="rise-in rise-delay-3 mt-6 max-w-full">
          <MissedPath label={copy.missedLabel} />
        </div>

        <div className="rise-in rise-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={copy.primary.href} size="lg">
            <House className="size-4" aria-hidden="true" />
            {copy.primary.label}
          </Button>
          <Button href={bookingCta.href} variant="accent" size="lg">
            <CalendarPlus className="size-4" aria-hidden="true" />
            {bookingCta.label}
          </Button>
        </div>

        {/* Helpful next steps */}
        <div className="rise-in rise-delay-4 mt-16 w-full max-w-4xl">
          <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted">
            {copy.suggestionsTitle}
          </p>
          <ul className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {copy.suggestions.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-2xl border border-sage-deep/30 bg-cream/85 p-5 shadow-soft backdrop-blur-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-mint-deep/40 hover:bg-cream hover:shadow-lift"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-mint-soft text-mint-deep transition-colors duration-300 group-hover:bg-mint group-hover:text-forest">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 font-display text-lg font-medium text-forest">
                      {item.label}
                      <ArrowRight
                        className="size-4 text-mint-deep transition-transform duration-300 ease-soft group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-muted">
                      {item.text}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-12 max-w-xl text-sm leading-relaxed text-muted">
          <span className="font-medium text-forest">{copy.support.lead}</span>{" "}
          {copy.support.text}{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-mint-deep underline decoration-mint-deep/40 underline-offset-4 hover:decoration-mint-deep"
          >
            {site.email}
          </a>{" "}
          {copy.support.or}{" "}
          <a
            href={site.phone.tel}
            className="font-medium text-mint-deep underline decoration-mint-deep/40 underline-offset-4 hover:decoration-mint-deep"
          >
            {site.phone.display}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
