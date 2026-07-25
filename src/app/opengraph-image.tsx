import { site } from "@/lib/site";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// Rendered once at build time, which is also when the logo file is readable
// from the project root.
export const dynamic = "force-static";

/**
 * The default social share image. Pages that need their own card set it
 * themselves (blog posts use their cover image); the rest of the static pages
 * have a sibling `opengraph-image.tsx` using the same template.
 */
export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Counselling · Testing · Reflective guidance",
    headline:
      "A gentle place to heal and grow — for children & teens, individuals, couples & families.",
  });
}
