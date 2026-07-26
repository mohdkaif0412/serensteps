import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { getService, serviceSlugs } from "@/lib/content/services";

export const alt = "Counselling at Serene Step";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Three known slugs, so all three cards are baked at build time rather than
// rendered per request.
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  return renderOgImage({
    eyebrow: service?.audience ?? "Our services",
    // The intro's opening sentence — one calm, complete line rather than a
    // paragraph squeezed into a card.
    headline: service
      ? `${service.intro.split(". ")[0]}.`
      : "Counselling and psychological testing, one gentle step at a time.",
  });
}
