import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The brand lockup — the client's artwork, not a re-typeset copy.
 *
 * Two inks ship for the same drawing, so the logo always has contrast: the
 * dark-green lockup on paper and other light surfaces, the mint lockup on the
 * deep forest bands. Pick with `tone`, which names the *surface*, not the ink.
 *
 * Height is set by the caller (`className="h-10 w-auto"`); width follows the
 * intrinsic 650×260 ratio.
 */
export function Logo({
  tone = "light",
  className,
  priority = false,
}: {
  /** The surface it sits on — `light` for paper, `dark` for forest. */
  tone?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={tone === "dark" ? site.logo.onDark : site.logo.onLight}
      alt={`${site.name} — ${site.tagline}`}
      width={site.logo.width}
      height={site.logo.height}
      priority={priority}
      className={cn("w-auto object-contain", className)}
    />
  );
}

/**
 * The mark on its own — the wave of faces, without the wordmark. For places
 * that already say the name in words.
 */
export function LogoMark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Image
      src={tone === "dark" ? site.logo.markOnDark : site.logo.markOnLight}
      alt=""
      aria-hidden="true"
      width={356}
      height={88}
      className={cn("w-auto object-contain", className)}
    />
  );
}
