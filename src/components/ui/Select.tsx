"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = {
  /** Id for the trigger button — pair it with a <label htmlFor={id}>. */
  id: string;
  options: readonly string[];
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  /** Id(s) of the element describing the field (e.g. the error message). */
  describedBy?: string;
  /** Styling for the trigger, passed by the form so it matches its inputs. */
  buttonClassName?: string;
};

/**
 * Custom select styled to the brand, built on the WAI-ARIA "select-only
 * combobox" pattern: DOM focus stays on the trigger; aria-activedescendant
 * tracks the highlighted option. Full keyboard support — arrows, Home/End,
 * Enter/Space/Tab to commit, Escape to dismiss, and printable-character
 * type-ahead. The open/close animation is spring-soft and collapses to a
 * plain fade when the visitor prefers reduced motion.
 */
export function Select({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Choose one…",
  invalid,
  describedBy,
  buttonClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selectedIndex = value ? options.indexOf(value) : -1;
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ buffer: "", at: 0 });
  const reduceMotion = useReducedMotion();
  const listboxId = useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  const openList = useCallback(() => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  const commit = useCallback(
    (index: number) => {
      const next = options[index];
      if (next !== undefined) onChange(next);
      setOpen(false);
    },
    [onChange, options],
  );

  // Close on any press outside the component.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view while navigating.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`#${CSS.escape(optionId(activeIndex))}`)
      ?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open]);

  const moveActive = (delta: number) => {
    setActiveIndex((current) =>
      Math.min(options.length - 1, Math.max(0, current + delta)),
    );
  };

  const handleTypeahead = (key: string) => {
    const now = Date.now();
    const state = typeahead.current;
    state.buffer = now - state.at > 500 ? key : state.buffer + key;
    state.at = now;
    const query = state.buffer.toLowerCase();
    const from = open ? activeIndex : Math.max(selectedIndex, 0);
    // Search after the active option first, then wrap.
    for (let step = 1; step <= options.length; step++) {
      const i = (from + step) % options.length;
      if (options[i].toLowerCase().startsWith(query)) {
        if (open) {
          setActiveIndex(i);
        } else {
          onChange(options[i]);
        }
        return;
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(key)) {
        event.preventDefault();
        openList();
        if (key === "Home") setActiveIndex(0);
        if (key === "End") setActiveIndex(options.length - 1);
        return;
      }
      if (key.length === 1 && key !== " " && !event.altKey && !event.ctrlKey && !event.metaKey) {
        handleTypeahead(key);
      }
      return;
    }

    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        // Commit the highlighted option, then let focus move on naturally.
        commit(activeIndex);
        break;
      default:
        if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          handleTypeahead(key);
        }
    }
  };

  const panelMotion = useMemo(
    () =>
      reduceMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.12 },
          }
        : {
            initial: { opacity: 0, y: -6, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -4, scale: 0.99 },
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
          },
    [reduceMotion],
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={cn(
          "flex items-center justify-between gap-3 text-left",
          buttonClassName,
          !value && "text-hint",
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-300 ease-soft",
            open && "-rotate-180 text-mint-deep",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={id}
            {...panelMotion}
            className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 max-h-64 origin-top overflow-auto rounded-xl border border-sage-deep/25 bg-cream p-1.5 shadow-lift"
          >
            {options.map((option, i) => {
              const selected = option === value;
              const active = i === activeIndex;
              return (
                <li
                  key={option}
                  id={optionId(i)}
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setActiveIndex(i)}
                  // Commit on pointerdown so it wins over the outside-close
                  // listener; preventDefault keeps focus on the trigger.
                  onPointerDown={(event) => {
                    event.preventDefault();
                    commit(i);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-[0.95rem] text-forest transition-colors duration-150",
                    active && "bg-mint-soft",
                    selected && "font-medium",
                  )}
                >
                  <span className="truncate">{option}</span>
                  {selected && (
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-mint-deep"
                      strokeWidth={2.5}
                    />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
