"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A primary CTA that leans very slightly toward the cursor, on a soft spring.
 * Enough to feel responsive and modern; nowhere near enough to feel like a toy.
 *
 * Kept honest about cost:
 *   · the element's box is measured once on pointer-enter, not on every move —
 *     no layout read per frame
 *   · only `x`/`y` transforms are written, both GPU-composited
 *   · coarse pointers (touch) never enter the handler at all, and
 *     prefers-reduced-motion disables it outright
 *
 * Wrap sparingly — the hero and closing CTAs, not every button on the page.
 */
export function Magnetic({
  children,
  /** Maximum lean, in px. Keep it under ~8. */
  strength = 6,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const box = useRef<DOMRect | null>(null);
  const spring = { stiffness: 240, damping: 20, mass: 0.35 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  if (reduceMotion) {
    return <span className={cn("inline-block", className)}>{children}</span>;
  }

  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        box.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(event) => {
        const rect = box.current;
        if (!rect) return;
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        x.set(dx * strength);
        y.set(dy * strength);
      }}
      onPointerLeave={() => {
        box.current = null;
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
