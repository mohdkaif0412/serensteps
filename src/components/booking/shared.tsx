"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The small pieces both booking shells share. Matching the contact form's
 * tactile fields (see ContactForm) so the two never look like different sites.
 */

export const bookingField =
  "w-full rounded-xl border border-field bg-sage-mist/70 px-4 py-3 text-forest placeholder:text-hint shadow-[inset_0_1px_2px_rgba(15,44,37,0.04)] transition-all duration-200 focus:border-mint-deep focus:bg-cream";

export function BookingField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-forest">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * A pickable card — used for session types and for how you'd like to meet.
 * Selected state is a forest fill rather than a mint outline: mint only reaches
 * 2.1:1 on paper, so it can carry a large fill but never a thin border that has
 * to be seen.
 */
export function OptionCard({
  title,
  description,
  meta,
  selected,
  onClick,
  icon,
}: {
  title: string;
  description?: string;
  meta?: string;
  selected?: boolean;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-soft @md:gap-4 @md:p-4",
        selected
          ? "border-forest bg-forest text-paper shadow-soft"
          : "border-sage-deep/25 bg-cream hover:border-mint-deep/40",
      )}
    >
      {icon && (
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full transition-colors @md:size-10",
            selected ? "bg-mint text-forest" : "bg-sage text-forest",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={cn(
              "font-display text-base @md:text-lg",
              selected ? "text-paper" : "text-forest",
            )}
          >
            {title}
          </span>
          {meta && (
            <span
              className={cn(
                "text-[0.68rem] font-medium uppercase tracking-[0.1em] @md:text-xs @md:tracking-[0.12em]",
                selected ? "text-mint-pale" : "text-muted",
              )}
            >
              {meta}
            </span>
          )}
        </span>
        {description && (
          <span
            className={cn(
              "mt-1 block text-[0.82rem] leading-relaxed @md:text-sm",
              selected ? "text-mint-pale" : "text-muted",
            )}
          >
            {description}
          </span>
        )}
      </span>
      {selected && (
        <Check className="size-5 shrink-0 text-mint" strokeWidth={2.5} aria-hidden="true" />
      )}
    </button>
  );
}

/** The quiet "one step back" link that sits under every question. */
export function BackLink({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-forest"
    >
      {label}
    </button>
  );
}

/** Minutes → "50 minutes" / "1 hour 15 minutes", for session-type meta. */
export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = `${hours} hour${hours === 1 ? "" : "s"}`;
  return rest ? `${hourLabel} ${rest} minutes` : hourLabel;
}
