"use client";

import { ChevronRight } from "lucide-react";
import { formatDuration } from "@/components/booking/shared";
import { bookingScript } from "@/lib/content/booking";
import type { PublicSessionType } from "@/lib/queries";

/**
 * The floating invitation to book.
 *
 * Two decisions worth keeping:
 *
 * · **The icon is the brand's own face**, not a chat glyph. It's the single
 *   face from the wave-of-faces mark (same geometry as `WaveMark`, which is a
 *   wide lockup and unreadable at 24px), so the button belongs to this practice
 *   rather than looking like a bolted-on support widget.
 *
 * · **The second line is derived, never written.** If the practitioner is
 *   offering something free it says so by name; if they retire it, the line
 *   changes by itself. A hardcoded "free intro call" would quietly become a lie
 *   the moment that session type was deleted.
 *
 * The mint halo breathes three times on arrival and then rests — an invitation,
 * not a permanent flicker beside someone's reading. The global reduced-motion
 * floor in globals.css collapses it to nothing.
 */
export function ChatLauncher({
  sessionTypes,
  onOpen,
  buttonRef,
}: {
  sessionTypes: PublicSessionType[];
  onOpen: () => void;
  buttonRef: React.Ref<HTMLButtonElement>;
}) {
  const free = sessionTypes.find((type) => /free/i.test(type.price));
  const subtitle = free
    ? `${free.name} · ${formatDuration(free.durationMin)}`
    : "Find a time that suits you";

  return (
    // `on-forest` flips the focus ring to pure mint — mint-deep would sit at
    // 1.4:1 against this fill.
    <div className="on-forest fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <span
        aria-hidden="true"
        className="launcher-halo pointer-events-none absolute inset-0 rounded-full bg-mint/40"
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-expanded={false}
        aria-label={bookingScript.launcher.open}
        className="group relative flex items-center gap-3 rounded-full bg-forest p-2 text-paper shadow-float ring-1 ring-mint/30 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:ring-mint/60 active:translate-y-0 active:scale-[0.97] sm:pr-5"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mint text-forest transition-transform duration-500 ease-soft group-hover:scale-105">
          <BrandFace className="size-6" />
        </span>

        {/* The label is desktop-only; on a phone the mark alone is the button,
            and `aria-label` carries the name for everyone. */}
        <span className="hidden pr-1 text-left sm:block">
          <span className="block text-sm font-semibold leading-snug">
            {bookingScript.launcher.label}
          </span>
          <span className="block text-[0.7rem] leading-snug text-mint-pale">
            {subtitle}
          </span>
        </span>

        <ChevronRight
          aria-hidden="true"
          className="hidden size-4 shrink-0 text-mint-pale transition-transform duration-300 ease-soft group-hover:translate-x-0.5 sm:block"
        />
      </button>
    </div>
  );
}

/**
 * One face from the wave — two dots and a smile, drawn with the same
 * proportions `WaveMark` uses for its crests.
 */
function BrandFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="7" cy="8.5" r="2" fill="currentColor" />
      <circle cx="17" cy="8.5" r="2" fill="currentColor" />
      <path
        d="M6 15C9 19.6 15 19.6 18 15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
