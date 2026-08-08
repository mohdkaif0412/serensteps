"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Mask = "soft" | "arch" | "arch-wide";

/* Same organic masks as `Photo`, so a video slots into the same layouts. */
const masks: Record<Mask, string> = {
  soft: "rounded-[2rem]",
  arch: "rounded-t-full rounded-b-[2rem]",
  "arch-wide": "rounded-t-[18%]",
};

export type SiteVideo = {
  src: string;
  label: string;
  poster?: string;
};

type VideoProps = {
  video: SiteVideo;
  mask?: Mask;
  /** Aspect ratio, width constraints, shadows — composed by the caller. */
  className?: string;
  /** Skip the duotone for footage that already sits under a scrim. */
  grade?: boolean;
};

/**
 * The video equivalent of `Photo`: same masks, same green duotone, same inset
 * ring — so a looping clip reads as part of the same curated set as the
 * site's photography, not a bolted-on media player.
 *
 * Autoplaying, muted, looping, and silent by construction (no controls, no
 * audio track expected) — it's motion in place of a photograph, not a video
 * a visitor is meant to watch start-to-finish. Under `prefers-reduced-motion`
 * autoplay and looping are skipped, so the reader gets a still first frame
 * instead of unrequested motion.
 */
export function Video({ video, mask = "soft", className, grade = true }: VideoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden", masks[mask], className)}>
      <video
        aria-label={video.label}
        poster={video.poster}
        autoPlay={!reduceMotion}
        loop={!reduceMotion}
        muted
        playsInline
        preload="metadata"
        className={cn(
          "size-full object-cover",
          grade && "[filter:saturate(0.3)_hue-rotate(-10deg)_contrast(1.05)]",
        )}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      {grade && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-forest/50 mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-mint/40 mix-blend-screen"
          />
        </>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-forest/10"
      />
    </div>
  );
}
