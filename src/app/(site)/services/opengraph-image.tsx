import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = "Serene Step services — counselling, testing, reflective guidance";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "Our services",
    headline:
      "Counselling and psychological testing for children & teens, individuals, and couples & families.",
  });
}
