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

// Meander geometry, in the SVG's own coordinate space.
const VB_W = 48;
const VB_H = 1600;
const CENTER = 24;
const AMP = 15;
const WAVES = 3;
const SAMPLES = 80;

const xAt = (t: number) => CENTER + AMP * Math.sin(t * Math.PI * WAVES);

/**
 * The signature "steps path": a thin, meandering vertical line that traces down
 * a long page, with step-markers that gently fill (honey) as the reader scrolls
 * into each section — encoding "Serene Steps, one step at a time."
 *
 * Wrap a page's sections with it. Decorative + desktop-only (the side gutter
 * doesn't exist on smaller screens). Respects prefers-reduced-motion: the path
 * renders complete and static instead of drawing in.
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

  // Build the meander as a finely-sampled polyline (smooth once vertically scaled).
  const d = useMemo(() => {
    let path = "";
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const x = xAt(t).toFixed(2);
      const y = (t * VB_H).toFixed(1);
      path += i === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
    }
    return path;
  }, []);

  // Marker anchor points, inset from the very top/bottom, sitting on the curve.
  const markers = useMemo(() => {
    return Array.from({ length: steps }, (_, i) => {
      const base = steps === 1 ? 0.5 : i / (steps - 1);
      const t = 0.04 + base * 0.92;
      return { t, leftPct: (xAt(t) / VB_W) * 100, topPct: t * 100 };
    });
  }, [steps]);

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
          <path
            d={d}
            fill="none"
            stroke="var(--color-sage-deep)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-honey)"
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
                  "block rounded-full border transition-all duration-500",
                  active
                    ? "size-3 border-honey bg-honey shadow-[0_0_0_4px_rgba(227,168,87,0.18)]"
                    : "size-2.5 border-sage-deep/50 bg-paper",
                )}
              />
            </span>
          );
        })}
      </div>

      {children}
    </div>
  );
}
