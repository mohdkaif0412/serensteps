"use client";

import { useMemo, useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

// Wave geometry, in the SVG's own coordinate space. One full period per step, so
// every crest and trough carries exactly one face — the same construction as the
// logo mark, turned on its side to thread down the page.
const VB_W = 48;
const VB_H = 1600;
const CENTER = 24;
const AMP = 15;
const SAMPLES = 240;

/** How far ahead of a face the light reaches it, as a fraction of the page. */
const LEAD = 0.06;

const xAt = (t: number, waves: number) =>
  CENTER + AMP * Math.sin(t * Math.PI * waves);

type Marker = { t: number; leftPct: number; topPct: number };

/**
 * One face on the wave, brightening as scroll progress reaches it.
 *
 * Everything is derived from the scroll MotionValue with `useTransform`, so
 * nothing here re-renders while the reader scrolls — the values are written
 * straight to the compositor. (The previous version kept a `lit` count in React
 * state and re-rendered every face on every scroll tick.)
 */
function JourneyMarker({
  marker,
  progress,
}: {
  marker: Marker;
  progress: MotionValue<number>;
}) {
  const range: [number, number] = [marker.t - LEAD, marker.t + 0.01];
  // 0 → not yet reached, 1 → fully lit.
  const lit = useTransform(progress, range, [0, 1], { clamp: true });
  const halo = useTransform(lit, [0, 1], [0, 0.3]);
  const haloScale = useTransform(lit, [0, 1], [0.6, 1]);

  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${marker.leftPct}%`, top: `${marker.topPct}%` }}
    >
      <span className="relative block">
        {/* Soft mint halo, blooming outward behind the opaque disc. */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -m-2 rounded-full bg-mint"
          style={{ opacity: halo, scale: haloScale }}
        />
        <span className="relative grid size-8 place-items-center rounded-full border border-sage-deep/40 bg-paper">
          {/* The mint ring fades in over the resting sage one. */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-mint"
            style={{ opacity: lit }}
          />
          {/* A small dot, crossfaded sage → mint. */}
          <span className="size-2 rounded-full bg-sage-deep" />
          <motion.span
            aria-hidden="true"
            className="absolute size-2 rounded-full bg-mint-deep"
            style={{ opacity: lit }}
          />
        </span>
      </span>
    </span>
  );
}

/**
 * The signature journey path: the logo's wave of faces, unrolled down the side
 * of a long page. The line brightens in mint as the reader scrolls and each face
 * wakes as it's reached — expressions moving from unsettled through calm to
 * star-eyed joy. That's the logo's own story, and the tagline's.
 *
 * Wrap a page's sections with it. Decorative, and desktop-only — the side gutter
 * doesn't exist on smaller screens. Respects prefers-reduced-motion: the path
 * renders complete with every face already lit, and nothing animates.
 */
export function StepsPath({
  children,
  steps = 6,
}: {
  children: ReactNode;
  steps?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  // Reduced motion: hold the journey at its end state — complete path, every
  // face lit — so the page reads as finished rather than as never started.
  const complete = useMotionValue(1);
  const progress = reduceMotion ? complete : smoothed;

  // One wave period per step keeps a face on every crest and trough.
  const waves = Math.max(1, steps);

  // Build the wave as a finely-sampled polyline (smooth once vertically scaled).
  const d = useMemo(() => {
    let path = "";
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      path += `${i === 0 ? "M" : " L"}${xAt(t, waves).toFixed(2)} ${(
        t * VB_H
      ).toFixed(1)}`;
    }
    return path;
  }, [waves]);

  // Faces sit on the wave's extrema — its crests and troughs.
  const markers = useMemo<Marker[]>(
    () =>
      Array.from({ length: steps }, (_, i) => {
        const t = (0.5 + i) / waves;
        return {
          t,
          leftPct: (xAt(t, waves) / VB_W) * 100,
          topPct: t * 100,
        };
      }),
    [steps, waves],
  );

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[max(0.5rem,calc((100vw-72rem)/2-3.25rem))] hidden w-12 xl:block"
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* The path not yet walked, waiting quietly */}
          <path
            d={d}
            fill="none"
            stroke="var(--color-sage-deep)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* A wide, faint mint bloom trailing the reader — depth under the line */}
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-mint)"
            strokeOpacity="0.28"
            strokeWidth="6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
          {/* …and the same line brightening in behind them */}
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-mint-deep)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
        </svg>

        {markers.map((marker, i) => (
          <JourneyMarker key={i} marker={marker} progress={progress} />
        ))}
      </div>

      {children}
    </div>
  );
}
