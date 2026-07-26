import Image from "next/image";
import { BLUR_DATA_URL, type SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Mask = "soft" | "arch" | "arch-wide";

/* Consistent organic masks so every photo on the site shares one hand.
   The arch — a gentle doorway — is the signature shape. */
const masks: Record<Mask, string> = {
  soft: "rounded-[2rem]",
  arch: "rounded-t-full rounded-b-[2rem]",
  "arch-wide": "rounded-t-[45%]",
};

type PhotoProps = {
  image: SiteImage;
  mask?: Mask;
  priority?: boolean;
  sizes?: string;
  /** Aspect ratio, width constraints, shadows — composed by the caller. */
  className?: string;
  /** Skip the duotone for images that already sit under a scrim. */
  grade?: boolean;
  /**
   * Artwork the client already supplied on-brand — the mint-duotoned hero photo
   * and the line illustration — must not be graded twice.
   */
  toned?: boolean;
};

/**
 * The one way photos are rendered sitewide: blur-up loading out of the brand
 * palette, plus the brand green duotone so mixed stock photography reads as one
 * curated set, matching the mint-toned photograph the client supplied.
 *
 * The duotone is two blend layers rather than an SVG filter, so it composites
 * on the GPU with no extra request:
 *   · desaturate + a slight green rotation flattens the source's own colour
 *   · forest multiply sinks the shadows into brand green
 *   · mint screen lifts the highlights toward brand mint
 */
export function Photo({
  image,
  mask = "soft",
  priority = false,
  sizes,
  className,
  grade = true,
  toned = false,
}: PhotoProps) {
  const duotone = grade && !toned;
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
        className={cn(
          "object-cover",
          duotone && "[filter:saturate(0.3)_hue-rotate(-10deg)_contrast(1.05)]",
        )}
      />
      {duotone && (
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
