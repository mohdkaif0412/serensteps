"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

// Wave geometry, in the SVG's own coordinate space. One full period per step, so
// every crest and trough carries exactly one face — the same construction as the
// logo mark, turned on its side to thread down the page.
const VB_W = 48;
const VB_H = 1600;
const CENTER = 24;
const AMP = 15;
const SAMPLES = 240;

const xAt = (t: number, waves: number) =>
  CENTER + AMP * Math.sin(t * Math.PI * waves);

type Mood = "unsettled" | "calm" | "joyful";

/**
 * A face from the logo's wave, small enough to sit in the page gutter. The mouth
 * carries the mood; the journey's last beat also gets the logo's star eyes.
 */
function JourneyFace({ mood, lit }: { mood: Mood; lit: boolean }) {
  const mouth =
    mood === "unsettled"
      ? "M7.5 16.2C9 13.9 15 13.9 16.5 16.2" // corners down — a frown
      : mood === "calm"
        ? "M7.5 14.8C9 16.1 15 16.1 16.5 14.8" // barely there
        : "M7 14.2C9 17.6 15 17.6 17 14.2"; // an open smile

  const star = (cx: number, cy: number) =>
    `M${cx} ${cy - 2.6}L${cx + 0.8} ${cy - 0.8}L${cx + 2.6} ${cy}` +
    `L${cx + 0.8} ${cy + 0.8}L${cx} ${cy + 2.6}L${cx - 0.8} ${cy + 0.8}` +
    `L${cx - 2.6} ${cy}L${cx - 0.8} ${cy - 0.8}Z`;

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-[22px] transition-colors duration-700 ease-soft",
        lit ? "text-mint-deep" : "text-sage-deep",
      )}
    >
      <g fill="currentColor">
        {mood === "joyful" ? (
          <>
            <path d={star(9, 9)} />
            <path d={star(15, 9)} />
          </>
        ) : (
          <>
            <circle cx="9" cy="9" r="1.7" />
            <circle cx="15" cy="9" r="1.7" />
          </>
        )}
      </g>
      <path
        d={mouth}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
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
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

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
  const markers = useMemo(
    () =>
      Array.from({ length: steps }, (_, i) => {
        const t = (0.5 + i) / waves;
        const fraction = steps === 1 ? 1 : i / (steps - 1);
        const mood: Mood =
          i === steps - 1
            ? "joyful"
            : fraction < 0.34
              ? "unsettled"
              : fraction < 0.7
                ? "calm"
                : "joyful";
        return {
          t,
          mood,
          leftPct: (xAt(t, waves) / VB_W) * 100,
          topPct: t * 100,
        };
      }),
    [steps, waves],
  );

  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduceMotion) setLit(steps);
  }, [reduceMotion, steps]);

  useMotionValueEvent(progress, "change", (v) => {
    if (reduceMotion) return;
    const count = markers.filter((m) => v >= m.t - 0.012).length;
    setLit((prev) => (prev === count ? prev : count));
  });

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
          {/* …and the same line brightening in behind the reader */}
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-mint-deep)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: reduceMotion ? 1 : progress }}
          />
        </svg>

        {markers.map((m, i) => {
          const active = i < lit;
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.leftPct}%`, top: `${m.topPct}%` }}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full border bg-paper transition-all duration-700 ease-soft",
                  active
                    ? "border-mint shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-mint)_20%,transparent)]"
                    : "border-sage-deep/40",
                )}
              >
                <JourneyFace mood={m.mood} lit={active} />
              </span>
            </span>
          );
        })}
      </div>

      {children}
    </div>
  );
}
