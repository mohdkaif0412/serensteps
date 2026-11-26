"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Accessible single-open disclosure list. Keyboard operable (native buttons),
 * proper aria-expanded / aria-controls wiring, reduced-motion aware. Every
 * answer is server-rendered, open or not — see the panel below.
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

            {/* Always in the DOM, collapsed with CSS. The answer used to be
                unmounted while closed, so the server HTML carried one answer
                out of thirteen — crawlers that don't run JavaScript (most AI
                bots) saw questions with no answers, and the FAQPage JSON-LD
                described text that wasn't on the page. `inert` keeps a closed
                answer out of the tab order and the accessibility tree, exactly
                as unmounting did. Reduced motion is handled by the global
                transition floor in globals.css. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-[350ms] ease-soft",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] px-1 pb-7 pr-8 leading-[1.8] text-muted sm:px-2 sm:pr-14">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
