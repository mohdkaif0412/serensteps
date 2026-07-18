"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger later elements in with a small delay. */
  delay?: number;
  /** Distance (px) the element rises from. */
  y?: number;
  /** Render as a different element for correct semantics/layout. */
  as?: "div" | "li" | "span" | "section";
};

/**
 * Scroll-triggered fade + rise. Runs once. Respects prefers-reduced-motion
 * (fades in place instead of translating). The one reusable motion wrapper
 * for section reveals across the site.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      // amount: "some" fires as soon as any part enters — reliable even when a
      // section is reached by an anchor jump or fast scroll (not just gradual).
      viewport={{ once: true, amount: "some" }}
    >
      {children}
    </MotionTag>
  );
}
