import { site } from "@/lib/site";
import type { PublicPost, PublicFaqGroup } from "@/lib/queries";
import {
  services,
  astrologyServices,
  tarotServices,
  reflectiveIntro,
  tarotIntro,
  servicePath,
  REFLECTIVE_PATH,
  type Service,
} from "@/lib/content/services";

/**
 * JSON-LD for the whole site.
 *
 * One business entity, not several: `MedicalBusiness` is a subtype of
 * `Organization`, so it is multi-typed and given a single stable `@id` that
 * every other node points at. That keeps search engines and answer engines from
 * seeing two competing descriptions of the same practice.
 *
 * IDs (fragment-scoped, so they're stable across environments):
 *   #organization  the practice
 *   #website       the site itself
 *   #practitioner  the named clinician, when configured
 *   #blog          the journal
 */
export const ORG_ID = `${site.url}/#organization`;
export const SITE_ID = `${site.url}/#website`;
export const PERSON_ID = `${site.url}/about#practitioner`;
export const BLOG_ID = `${site.url}/blog#blog`;

// The full lockup, not the favicon — search engines prefer a real logo asset.
const orgLogo = `${site.url}${site.logo.onLight}`;

/** Reach, as a string for JSON-LD. Falls back to the reach-neutral default. */
const areaServed = site.serviceArea || "Online and in person";

type Json = Record<string, unknown>;

/** Drop keys whose value is empty, so no node carries a blank field. */
function compact(node: Json): Json {
  return Object.fromEntries(
    Object.entries(node).filter(([, v]) => {
      if (v === undefined || v === null || v === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  );
}

/* ── The practice ─────────────────────────────────────────────────── */

function postalAddress(): Json | undefined {
  const loc = site.location;
  if (!loc) return undefined;
  return compact({
    "@type": "PostalAddress",
    streetAddress: loc.street,
    addressLocality: loc.locality,
    addressRegion: loc.region,
    postalCode: loc.postalCode,
    addressCountry: loc.country,
  });
}

function geoCoordinates(): Json | undefined {
  const loc = site.location;
  if (!loc?.latitude || !loc?.longitude) return undefined;
  return {
    "@type": "GeoCoordinates",
    latitude: Number(loc.latitude),
    longitude: Number(loc.longitude),
  };
}

/**
 * "Mo-Fr 10:00-18:00" → an OpeningHoursSpecification. Anything that doesn't
 * parse is skipped rather than emitted malformed.
 */
function openingHoursSpecification(): Json[] {
  const DAYS: Record<string, string> = {
    mo: "Monday",
    tu: "Tuesday",
    we: "Wednesday",
    th: "Thursday",
    fr: "Friday",
    sa: "Saturday",
    su: "Sunday",
  };
  const ORDER = Object.keys(DAYS);

  return site.openingHours.flatMap((entry) => {
    const match = entry.match(
      /^([A-Za-z]{2})(?:\s*-\s*([A-Za-z]{2}))?\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/,
    );
    if (!match) return [];
    const [, from, to, opens, closes] = match;
    const start = ORDER.indexOf(from.toLowerCase());
    if (start === -1) return [];
    const end = to ? ORDER.indexOf(to.toLowerCase()) : start;
    if (end === -1) return [];
    const span = ORDER.slice(start, end + 1).map((d) => DAYS[d]);
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: span,
        opens,
        closes,
      },
    ];
  });
}

/** The two headline offerings — mirrors the two groups on /services. */
const OFFERINGS = [
  {
    name: "Counselling & Testing",
    description:
      "Counselling and psychological assessment for children & teens, individuals, and couples & families.",
    url: `${site.url}/services#counselling-testing`,
  },
  {
    name: "Astrology & Tarot",
    description:
      "Optional reflective guidance used alongside counselling — never as a substitute for mental-health treatment, and never to predict the future.",
    url: `${site.url}${REFLECTIVE_PATH}`,
  },
] as const;

/** The practice: Organization + MedicalBusiness, fully enriched. */
function organizationNode(): Json {
  return compact({
    "@type": ["Organization", "MedicalBusiness"],
    "@id": ORG_ID,
    name: site.name,
    alternateName: "Serene Steps",
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: `+${site.phone.digits}`,
    logo: {
      "@type": "ImageObject",
      url: orgLogo,
      width: site.logo.width,
      height: site.logo.height,
    },
    image: `${site.url}/opengraph-image`,
    priceRange: site.priceRange,
    areaServed,
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: site.location?.mapUrl,
    openingHoursSpecification: openingHoursSpecification(),
    medicalSpecialty: ["Psychiatric", "Public Health"],
    knowsAbout: site.topics,
    availableLanguage: ["English", "Hindi", "Urdu"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.email,
        telephone: `+${site.phone.digits}`,
        availableLanguage: ["English", "Hindi", "Urdu"],
        areaServed,
      },
    ],
    // `availableService` names the clinical work; `makesOffer` frames the same
    // two tabs commercially. Both are wanted: the first is the medical signal,
    // the second the offer signal.
    availableService: services.map((service) => ({
      "@type": ["MedicalTherapy", "Service"],
      "@id": `${site.url}${servicePath(service.slug)}#service`,
      name: `${service.title} counselling`,
    })),
    makesOffer: OFFERINGS.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      url: offer.url,
    })),
    ...(site.practitioner
      ? { employee: { "@id": PERSON_ID }, founder: { "@id": PERSON_ID } }
      : {}),
    sameAs: [site.socials.instagram, site.socials.facebook].filter(Boolean),
  });
}

/** The site itself, published by the practice. */
function webSiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * The named practitioner. Returns `undefined` until the real name is set —
 * see `practitioner` in src/lib/site.ts.
 */
function personNode(): Json | undefined {
  const person = site.practitioner;
  if (!person) return undefined;
  return compact({
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    jobTitle: person.jobTitle,
    url: `${site.url}/about`,
    worksFor: { "@id": ORG_ID },
    knowsAbout: site.topics,
    hasCredential: person.credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      name: credential,
    })),
  });
}

/**
 * The sitewide graph: practice + site (+ practitioner). Rendered once from the
 * public layout, so every indexable page carries it.
 */
export function siteGraphJsonLd(): Json {
  const person = personNode();
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), webSiteNode(), ...(person ? [person] : [])],
  };
}

/* ── Breadcrumbs ──────────────────────────────────────────────────── */

export type Crumb = { name: string; path: string };

/**
 * BreadcrumbList for an inner page. Home is prepended automatically, so a page
 * passes only its own trail:
 *
 *   breadcrumbJsonLd([{ name: "Journal", path: "/blog" }, { name: post.title, path: `/blog/${slug}` }])
 */
export function breadcrumbJsonLd(trail: Crumb[]): Json {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

/* ── Services ─────────────────────────────────────────────────────── */

/**
 * One audience's counselling work, as a node.
 *
 * Multi-typed `MedicalTherapy` — this is clinical work. Every node is `@id`'d
 * at its own page (`/services/<slug>#service`) rather than at a fragment of the
 * index, so the detail page and the index agree on one canonical entity.
 */
function serviceNode(service: Service): Json {
  const url = `${site.url}${servicePath(service.slug)}`;
  return compact({
    "@type": ["MedicalTherapy", "Service"],
    "@id": `${url}#service`,
    name: `${service.title} counselling`,
    alternateName: service.audience,
    description: service.intro,
    serviceType: "Counselling and psychological assessment",
    url,
    provider: { "@id": ORG_ID },
    areaServed,
    audience: { "@type": "PeopleAudience", name: service.audience },
    // What people arrive carrying — the concerns this work addresses.
    relevantSpecialty: { "@type": "MedicalSpecialty", name: "Psychiatric" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `What we help with — ${service.title}`,
      itemListElement: service.helps.flatMap((group) =>
        group.items.map((item) => ({
          "@type": "Offer",
          itemOffered: compact({
            "@type": "Service",
            name: item,
            category: group.title,
            provider: { "@id": ORG_ID },
          }),
        })),
      ),
    },
  });
}

/**
 * The reflective offering, as a node. Deliberately plain `Service`, never
 * `MedicalTherapy`: the practice is explicit that it is reflective and not
 * treatment, and the markup says exactly the same thing.
 */
function reflectiveNode(): Json {
  const url = `${site.url}${REFLECTIVE_PATH}`;
  return compact({
    "@type": "Service",
    "@id": `${url}#service`,
    name: "Astrology & tarot — reflective guidance",
    description: reflectiveIntro.body.join(" "),
    // Load-bearing framing: keep it in the markup as well as on the page.
    disambiguatingDescription:
      "Reflective tools offered alongside counselling. Never a substitute for mental-health treatment, and never used to predict the future.",
    serviceType: "Reflective guidance",
    url,
    provider: { "@id": ORG_ID },
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Reflective guidance sessions",
      itemListElement: [
        ...astrologyServices.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            category: "Astrology",
            description: service.outcome,
            url: `${url}#${service.slug}`,
          },
        })),
        ...tarotServices.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Tarot guidance — ${service.title}`,
            category: "Tarot",
            description: `${service.focus} ${tarotIntro}`,
            url: `${url}#${service.slug}`,
          },
        })),
      ],
    },
  });
}

/** Every offering at once — for the /services index. */
export function servicesJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [...services.map(serviceNode), reflectiveNode()],
  };
}

/** Just this audience's node — for a /services/[slug] detail page. */
export function serviceJsonLd(service: Service): Json {
  return { "@context": "https://schema.org", ...serviceNode(service) };
}

/** Just the reflective node — for /services/astrology-tarot. */
export function reflectiveServiceJsonLd(): Json {
  return { "@context": "https://schema.org", ...reflectiveNode() };
}

/**
 * The /services index as a browsable list, so a crawler gets the whole set of
 * detail pages from the index in one node.
 */
export function servicesItemListJsonLd(): Json {
  const entries = [
    ...services.map((service) => ({
      name: `${service.title} counselling`,
      path: servicePath(service.slug),
    })),
    { name: "Astrology & tarot — reflective guidance", path: REFLECTIVE_PATH },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${site.url}/services#list`,
    name: `${site.name} — services`,
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      url: `${site.url}${entry.path}`,
    })),
  };
}

/* ── Blog ─────────────────────────────────────────────────────────── */

/** Author: the named practitioner when known, otherwise the practice itself. */
function authorRef(): Json {
  return site.practitioner
    ? { "@id": PERSON_ID }
    : { "@type": "Organization", "@id": ORG_ID, name: site.name };
}

/** Topics from `site.topics` that the piece actually talks about. */
function keywordsFor(post: PublicPost): string[] {
  const haystack = `${post.title} ${post.excerpt} ${post.content}`
    .replace(/<[^>]*>/g, " ")
    .toLowerCase();
  const matched = site.topics.filter((topic) =>
    haystack.includes(topic.toLowerCase()),
  );
  return [...new Set([post.category, ...matched])];
}

/** BlogPosting schema for a single post. */
export function blogPostingJsonLd(post: PublicPost): Json {
  const url = `${site.url}/blog/${post.slug}`;
  return compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.category,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    keywords: keywordsFor(post),
    inLanguage: "en",
    url,
    author: authorRef(),
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": BLOG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  });
}

/** Blog schema for the journal index — gives crawlers the whole list at once. */
export function blogJsonLd(posts: PublicPost[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    name: `${site.name} — Journal`,
    description:
      "Gentle, practical writing on anxiety, relationships, parenting, starting therapy, and reflective practice.",
    url: `${site.url}/blog`,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${site.url}/blog/${post.slug}#article`,
      headline: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: authorRef(),
    })),
  };
}

/* ── FAQ ──────────────────────────────────────────────────────────── */

/** FAQPage schema built from the published FAQ groups. */
export function faqPageJsonLd(groups: PublicFaqGroup[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}/faq#faq`,
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    mainEntity: groups
      .flatMap((g) => g.items)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
  };
}

/**
 * DefinedTermSet for the glossary on /resources — the shape answer engines
 * quote from. Each entry is a term plus its short, self-contained definition.
 */
export function glossaryJsonLd(
  entries: { term: string; short: string; slug: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${site.url}/resources#glossary`,
    name: `${site.name} — plain-language guide to therapy terms`,
    url: `${site.url}/resources`,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    hasDefinedTerm: entries.map((entry) => ({
      "@type": "DefinedTerm",
      "@id": `${site.url}/resources#${entry.slug}`,
      name: entry.term,
      description: entry.short,
      inDefinedTermSet: { "@id": `${site.url}/resources#glossary` },
      url: `${site.url}/resources#${entry.slug}`,
    })),
  };
}
