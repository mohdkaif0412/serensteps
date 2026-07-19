import Image from "next/image";
import { BLUR_DATA_URL, type SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Mask = "soft" | "arch" | "arch-wide";

/* Consistent organic masks so every photo on the site shares one hand.
   The arch — a gentle doorway — is the signature shape. */
const masks: Record<Mask, string> = {
  soft: "rounded-[2rem]",
  arch: "rounded-t-full rounded-b-[2rem]",
  "arch-wide": "rounded-t-[45%] rounded-b-[2rem]",
};

type PhotoProps = {
  image: SiteImage;
  mask?: Mask;
  priority?: boolean;
  sizes?: string;
  /** Aspect ratio, width constraints, shadows — composed by the caller. */
  className?: string;
  /** Skip the warm grade for images that already sit under a scrim. */
  grade?: boolean;
};

/**
 * The one way photos are rendered sitewide: blur-up loading out of the brand
 * palette, a subtle warm duotone grade (slightly desaturated + pine multiply +
 * honey glow) so mixed stock photography reads as one curated set, and a
 * hairline inner ring for a tactile edge.
 */
export function Photo({
  image,
  mask = "soft",
  priority = false,
  sizes,
  className,
  grade = true,
}: PhotoProps) {
  return (
    <div className={cn("relative overflow-hidden", masks[mask], className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover [filter:saturate(0.88)_sepia(0.07)]"
      />
      {grade && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-pine/15 mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-honey/15 mix-blend-soft-light"
          />
        </>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-pine/10"
      />
    </div>
  );
}
