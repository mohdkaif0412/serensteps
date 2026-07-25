"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The brand mark as line art: the wave of faces, drawing itself once.
 *
 * The lockup in `public/brand/` is a raster PNG, so it can't be drawn — this is
 * the same motif reconstructed as SVG geometry (identical sine construction to
 * StepsPath, laid horizontally) purely so it can be animated. The line traces
 * itself left to right, then each face wakes in turn.
 *
 * Decorative: `aria-hidden`, no text alternative, never load-bearing. Under
 * prefers-reduced-motion it renders complete and still.
 */

const W = 480;
const H = 96;
const MID = H / 2;
const AMP = 26;
const PERIODS = 3;
const SAMPLES = 160;

const yAt = (t: number) => MID - AMP * Math.sin(t * Math.PI * 2 * PERIODS);

const PATH = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const t = i / SAMPLES;
  return `${i === 0 ? "M" : "L"}${(t * W).toFixed(1)} ${yAt(t).toFixed(1)}`;
}).join(" ");

// A face on every crest and trough — six across three periods.
const FACES = Array.from({ length: PERIODS * 2 }, (_, i) => {
  const t = (0.25 + i * 0.5) / PERIODS;
  return { x: t * W, y: yAt(t), crest: i % 2 === 0, at: t };
});

export function WaveMark({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-16 w-auto", className)}
      fill="none"
    >
      <motion.path
        d={PATH}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {FACES.map((face, i) => (
        <motion.g
          key={i}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          // Each face lands just after the line has passed through it.
          transition={{
            duration: 0.5,
            delay: 0.25 + face.at * 1.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={face.x - 5} cy={face.y - 4} r="2.1" fill="currentColor" />
          <circle cx={face.x + 5} cy={face.y - 4} r="2.1" fill="currentColor" />
          <path
            // Crests smile, troughs rest — the wave's own rise and fall.
            d={
              face.crest
                ? `M${face.x - 6} ${face.y + 3}C${face.x - 3} ${face.y + 8} ${face.x + 3} ${face.y + 8} ${face.x + 6} ${face.y + 3}`
                : `M${face.x - 6} ${face.y + 5}C${face.x - 3} ${face.y + 7} ${face.x + 3} ${face.y + 7} ${face.x + 6} ${face.y + 5}`
            }
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </motion.g>
      ))}
    </svg>
  );
}
