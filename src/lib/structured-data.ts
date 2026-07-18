import { site } from "@/lib/site";
import type { PublicPost, PublicFaqGroup } from "@/lib/queries";

const orgLogo = `${site.url}/icon.svg`;

/** Sitewide MedicalBusiness / LocalBusiness. */
export function medicalBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
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
