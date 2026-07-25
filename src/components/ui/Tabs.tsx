"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TabItem = {
  /** Used in the URL hash, so keep it slug-shaped and stable. */
  id: string;
  label: string;
  /** Optional second line inside the control. */
  hint?: string;
  panel: ReactNode;
  /**
   * Anchors that live inside this panel (e.g. `children-teens`). A deep link to
   * one of them selects this tab first, so the target is actually visible.
   */
  anchors?: readonly string[];
};

/**
 * Segmented tabs built on the WAI-ARIA tabs pattern: a single tab stop, arrow
 * keys / Home / End to move between tabs, and `aria-controls` wiring each tab to
 * its panel. Inactive panels stay in the DOM but `hidden`, so their content is
 * still crawlable while being correctly hidden from assistive tech.
 *
 * The selected tab is mirrored into the URL hash via `replaceState` — that makes
 * each offering linkable without adding a history entry or a scroll jump.
 */
export function Tabs({
  tabs,
  label,
  className,
}: {
  tabs: TabItem[];
  /** Accessible name for the tablist. */
  label: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Honour a deep link, whether it points at a tab or at an anchor inside one.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const index = tabs.findIndex(
      (tab) => tab.id === hash || tab.anchors?.includes(hash),
    );
    if (index < 0) return;
    setActive(index);
    // The target was still `hidden` when the browser tried to scroll to it, so
    // re-run the scroll once its panel is visible. Two frames: the first lets
    // React commit the new `active`, the second lets layout settle.
    if (tabs[index].id !== hash) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document.getElementById(hash)?.scrollIntoView({ block: "start" }),
        ),
      );
    }
    // Deep links are a first-paint concern only — later hash changes come from
    // `select` below, which is already the source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only ever called from a click or a keypress, so writing the hash here can't
  // add one to a bare /services URL nobody asked to deep-link into.
  const select = useCallback(
    (index: number) => {
      setActive(index);
      history.replaceState(null, "", `#${tabs[index].id}`);
    },
    [tabs],
  );

  const focusTab = (index: number) => {
    const buttons =
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = active === last ? 0 : active + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = active === 0 ? last : active - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
    focusTab(next);
  };

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        // No aria-orientation: the list is a row on desktop and a column on
        // mobile, and the key handler accepts both axes either way.
        onKeyDown={onKeyDown}
        className="mx-auto flex w-full max-w-2xl flex-col gap-1.5 rounded-[1.75rem] border border-sage-deep/30 bg-sage-mist p-1.5 shadow-soft sm:flex-row sm:rounded-full"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "relative flex-1 cursor-pointer rounded-full px-5 py-3 text-center transition-colors duration-300",
                selected ? "text-forest" : "text-muted hover:text-forest",
              )}
            >
              {selected && (
                // Shared layoutId → the mint pill glides between the two tabs.
                <motion.span
                  layoutId="services-tab-pill"
                  aria-hidden="true"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 34 }
                  }
                  className="absolute inset-0 rounded-full bg-mint shadow-soft"
                />
              )}
              <span className="relative block text-[0.95rem] font-semibold sm:text-base">
                {tab.label}
              </span>
              {tab.hint && (
                // Full opacity in both states — the hierarchy comes from size,
                // not transparency, which was dropping these below AA.
                <span
                  className={cn(
                    "relative mt-0.5 block text-[0.72rem] leading-tight transition-colors duration-300",
                    selected ? "text-forest" : "text-muted",
                  )}
                >
                  {tab.hint}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={i !== active}
          // Panels are long; they own their focus order rather than being one
          // big tab stop, so no tabIndex here.
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
