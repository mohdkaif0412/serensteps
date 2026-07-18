/**
 * Central image registry.
 *
 * These point at curated, license-clean photos in `/public/images/`
 * (real Unsplash photography, free for commercial use, no attribution
 * required). To change a photo, drop a new file in `/public/images/` with the
 * same name — no code change needed.
 */

export type SiteImage = {
  src: string;
  alt: string;
};

export const img = {
  hero: {
    src: "/images/hero-path.jpg",
    alt: "Soft light on a quiet path through the trees",
  },
  welcome: {
    src: "/images/welcome-window.jpg",
    alt: "An empty bench in soft daylight — a place to pause",
  },
  teens: {
    src: "/images/service-teens.jpg",
    alt: "A young person sitting quietly by calm water",
  },
  individual: {
    src: "/images/service-individual.jpg",
    alt: "A person pausing to reflect, looking out over the water",
  },
  couples: {
    src: "/images/service-couples.jpg",
    alt: "Trees standing together in warm evening light",
  },
  approach: {
    src: "/images/approach-hands.jpg",
    alt: "Hands cradling a warm cup of tea",
  },
  about: {
    src: "/images/about-portrait.jpg",
    alt: "A warm, quiet moment in golden light",
  },
  cta: {
    src: "/images/cta-leaves.jpg",
    alt: "Sunlight through soft green leaves",
  },
} satisfies Record<string, SiteImage>;

// Calm cover images for the seeded blog posts (stable, license-clean Unsplash
// photos via Picsum's /id/ endpoint). Admin-uploaded covers override these.
const BLOG_COVERS: Record<string, string> = {
  "the-first-step-into-therapy": "13",
  "anxiety-and-overthinking": "306",
  "boundaries-without-guilt": "29",
  "supporting-a-teen-who-shuts-down": "235",
};

export const postCover = (slug: string, w = 1200, h = 800) =>
  `https://picsum.photos/id/${BLOG_COVERS[slug] ?? "1015"}/${w}/${h}`;
