import { site } from "@/lib/site";
import type { PublicPost, PublicFaqGroup } from "@/lib/queries";

// The full lockup, not the favicon — search engines prefer a real logo asset.
const orgLogo = `${site.url}${site.logo.onLight}`;

/** Sitewide MedicalBusiness / LocalBusiness. */
export function medicalBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: `+${site.phone.digits}`,
    logo: orgLogo,
    image: `${site.url}/opengraph-image`,
    areaServed: "Online and in person",
    knowsAbout: [
      "Therapy",
      "Counselling",
      "Anxiety",
      "Relationships",
      "Trauma",
      "Mental wellness",
      "Child and adolescent therapy",
      "Psychometric and career assessment",
      "Couple and family counselling",
      "Astrology and tarot as reflective tools",
    ],
    // `makesOffer` mirrors the two tabs on /services.
    makesOffer: [
      {
        "@type": "Offer",
        name: "Counselling & Testing",
        description:
          "Counselling and psychological assessment for children & teens, individuals, and couples & families.",
        url: `${site.url}/services#counselling-testing`,
      },
      {
        "@type": "Offer",
        name: "Astrology & Tarot",
        description:
          "Optional reflective guidance used alongside counselling — never as a substitute for mental-health treatment, and never to predict the future.",
        url: `${site.url}/services#astrology-tarot`,
      },
    ],
    sameAs: [site.socials.instagram, site.socials.facebook].filter(Boolean),
  };
}

/** Article schema for a blog post. */
export function articleJsonLd(post: PublicPost): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleSection: post.category,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: orgLogo },
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };
}

/** FAQPage schema built from the published FAQ groups. */
export function faqPageJsonLd(groups: PublicFaqGroup[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups
      .flatMap((g) => g.items)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
  };
}
