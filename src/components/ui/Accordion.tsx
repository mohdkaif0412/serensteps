"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Accessible single-open disclosure list. Keyboard operable (native buttons),
 * proper aria-expanded / aria-controls wiring, reduced-motion aware.
 * One icon, one gesture: the plus rotates into a close mark.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <div className="divide-y divide-sage-deep/25 border-y border-sage-deep/25">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-button-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i} className={cn("transition-colors duration-300", isOpen && "bg-cream/60")}>
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-5 px-1 py-6 text-left sm:px-2"
              >
                <span
                  className={cn(
                    "font-display text-lg leading-snug transition-colors duration-300 sm:text-xl",
                    isOpen ? "italic text-forest" : "text-forest group-hover:text-forest-soft",
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-soft",
                    isOpen
                      ? "rotate-45 border-mint bg-mint text-forest shadow-soft"
                      : "border-sage-deep/40 text-muted group-hover:border-mint-deep group-hover:text-forest",
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-4" strokeWidth={2} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] px-1 pb-7 pr-8 leading-[1.8] text-muted sm:px-2 sm:pr-14">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
