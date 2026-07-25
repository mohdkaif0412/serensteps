"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CREST =
  "M0 34 C 180 56 340 8 560 14 C 800 21 980 54 1180 44 C 1290 38 1380 26 1440 18 L 1440 56 L 0 56 Z";

/**
 * Organic section edge: a gentle, asymmetric crest painted in `currentColor`
 * over whatever sits behind it, so bands meet with a soft wave instead of a
 * hard rectangular break. Set the color via `text-*` on the svg:
 *
 *   <WaveEdge className="text-forest" />        // top edge of a forest band
 *   <WaveEdge className="text-forest" flip />   // bottom edge of a forest band
 *
 * The crest swells up into place as it enters the viewport — a scaleY from its
 * own flat base, so it reads as the band rising rather than a shape appearing.
 * Transform and opacity only, anchored to a fixed-height box, so it can't shift
 * layout. `animate={false}` opts out; prefers-reduced-motion opts out for you.
 */
export function WaveEdge({
  className,
  flip = false,
  animate = true,
}: {
  className?: string;
  flip?: boolean;
  animate?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const draw = animate && !reduceMotion;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 56"
      preserveAspectRatio="none"
      className={cn("block h-8 w-full sm:h-12", flip && "rotate-180", className)}
    >
      <motion.path
        d={CREST}
        fill="currentColor"
        // `fill-box` so the origin is the path's own flat bottom edge, not the
        // SVG user-space origin.
        style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        initial={draw ? { scaleY: 0.55, opacity: 0.55 } : false}
        whileInView={draw ? { scaleY: 1, opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.3, margin: "0px 0px -5% 0px" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
