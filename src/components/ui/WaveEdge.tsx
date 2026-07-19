import { cn } from "@/lib/utils";

/**
 * Organic section edge: a gentle, asymmetric crest painted in `currentColor`
 * over whatever sits behind it, so bands meet with a soft wave instead of a
 * hard rectangular break. Set the color via `text-*` on the svg:
 *
 *   <WaveEdge className="text-pine" />        // top edge of a pine band
 *   <WaveEdge className="text-pine" flip />   // bottom edge of a pine band
 */
export function WaveEdge({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 56"
      preserveAspectRatio="none"
      className={cn("block h-8 w-full sm:h-12", flip && "rotate-180", className)}
    >
      <path
        d="M0 34 C 180 56 340 8 560 14 C 800 21 980 54 1180 44 C 1290 38 1380 26 1440 18 L 1440 56 L 0 56 Z"
        fill="currentColor"
      />
    </svg>
  );
}
