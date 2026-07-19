"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger later elements in with a small delay (capped — see MAX_DELAY). */
  delay?: number;
  /** Distance (px) the element settles up from. */
  y?: number;
  /** Render as a different element for correct semantics/layout. */
  as?: "div" | "li" | "span" | "section";
};

// Cap any caller-supplied stagger so nothing ever waits long enough to read as
// a blank screen. Combined with the short settle below, total reveal ≈ 0.5s.
const MAX_DELAY = 0.18;

/**
 * Scroll-triggered settle: a quick fade plus a soft spring on y, so content
 * lands with a gentle exhale rather than a generic linear fade-up. Runs once
 * and reveals *early* — the viewport trigger fires as the element approaches
 * (low threshold + negative bottom margin), so during normal scrolling content
 * is already visible on arrival; no blank-then-pop-in frames.
 *
 * Respects prefers-reduced-motion: renders at full opacity with no transform
 * and no transition (instantly visible). The one reusable motion wrapper for
 * section reveals across the site.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const cappedDelay = Math.min(delay, MAX_DELAY);

  const variants: Variants = reduceMotion
    ? {
        // No transform, no transition — always fully visible.
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        // Start *nearly* opaque (0.001) rather than fully transparent so a
        // brief pre-reveal frame is imperceptible instead of a blank flash.
        hidden: { opacity: 0.001, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            opacity: { duration: 0.35, ease: "easeOut", delay: cappedDelay },
            y: {
              type: "spring",
              stiffness: 210,
              damping: 26,
              mass: 0.7,
              delay: cappedDelay,
            },
          },
        },
      };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      // Fire early: as soon as ~10% is visible, and 10% *before* the element
      // reaches the bottom of the viewport (negative bottom margin). Reliable
      // for anchor jumps and fast scrolls alike. `once` keeps it from replaying;
      // whileInView (vs. a manual observer) guarantees no permanently-hidden
      // state — the element always resolves to `visible`.
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}
