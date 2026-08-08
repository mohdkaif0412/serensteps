import Image from "next/image";
import { BLUR_DATA_URL, type SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Mask = "soft" | "arch" | "arch-wide";
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
  className?: string;
  grade?: boolean;
  toned?: boolean;
};

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
