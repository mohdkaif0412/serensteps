"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Subtle scroll parallax — hero imagery only; the rest of the site stays
 * still. Fully disabled under prefers-reduced-motion.
 */
export function Parallax({
  children,
  range = 20,
  className,
}: {
  children: ReactNode;
  /** Total drift in px across the element's time on screen. Keep small. */
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
