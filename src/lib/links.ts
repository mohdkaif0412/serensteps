import {
  services,
  servicePath,
  REFLECTIVE_PATH,
  type Service,
} from "@/lib/content/services";
import { glossaryEntries, type GlossaryEntry } from "@/lib/content/resources";
import type { PublicPost } from "@/lib/queries";

/**
 * Internal-link relationships, derived rather than hand-maintained.
 *
 * The site already knows how its pages relate: every glossary entry names the
 * service it leads to, every post has a category, every service has a heading.
 * These helpers turn that into links, so a new post or glossary term is wired
 * into the site the moment it exists instead of waiting for someone to
 * remember to link it.
 */

export type ServiceLink = { href: string; label: string };

/**
 * Every service as a link, with descriptive anchor text ("Individual
 * counselling for adults", not "Learn more"). Counselling pages first, the
 * reflective offering last — the same order as the Services index.
 */
export const serviceLinks: ServiceLink[] = [
  ...services.map((service) => ({
    href: servicePath(service.slug),
    label: `${service.heading.lead} ${service.heading.accent}`,
  })),
  { href: REFLECTIVE_PATH, label: "Astrology & tarot — reflective guidance" },
];

const linkFor = (href: string) => serviceLinks.find((link) => link.href === href);

/* ── Service → glossary ───────────────────────────────────────────── */

/**
 * The glossary terms that lead to this service, straight from each entry's
 * `related` links. `path` is a service path such as `/services/individuals`.
 */
export function glossaryForService(path: string, limit = 4): GlossaryEntry[] {
  const leadsTo = (entry: GlossaryEntry, match: (href: string) => boolean) =>
    entry.related?.some((link) => match(link.href)) ?? false;

  return glossaryEntries
    .map((entry) => ({
      entry,
      // A link to the page itself is a stronger tie than one to a section of it
      // ("Attachment style" only reaches the astrology page via one reading).
      tie: leadsTo(entry, (href) => href === path)
        ? 2
        : leadsTo(entry, (href) => href.startsWith(`${path}#`))
          ? 1
          : 0,
    }))
    .filter(({ tie }) => tie > 0)
    .sort((a, b) => b.tie - a.tie) // stable: glossary order within a tie
    .slice(0, limit)
    .map(({ entry }) => entry);
}

/* ── Post → service ───────────────────────────────────────────────── */

/**
 * Journal categories are free text set in the admin. These are the ones the
 * site starts with; anything else falls through to the keyword rules below.
 */
const CATEGORY_SERVICES: Record<string, string[]> = {
  reflection: [REFLECTIVE_PATH],
  "getting started": [servicePath("individuals")],
  anxiety: [servicePath("individuals")],
  relationships: [servicePath("couples-families"), servicePath("individuals")],
  parenting: [servicePath("children-teens"), servicePath("couples-families")],
};

const KEYWORD_SERVICES: [RegExp, string[]][] = [
  [/\b(astrolog|tarot|birth chart|horoscope)/i, [REFLECTIVE_PATH]],
  [/\b(teen|adolescen|child|school|parent)/i, [servicePath("children-teens")]],
  [
    /\b(couple|partner|marriage|famil|co-?parent)/i,
    [servicePath("couples-families")],
  ],
];

/** The service pages most relevant to a post, most relevant first. */
export function servicesForPost(
  post: Pick<PublicPost, "category" | "title" | "excerpt">,
  limit = 2,
): ServiceLink[] {
  const byCategory = CATEGORY_SERVICES[post.category.trim().toLowerCase()] ?? [];
  const text = `${post.title} ${post.excerpt}`;
  const byKeyword = KEYWORD_SERVICES.filter(([pattern]) => pattern.test(text)).flatMap(
    ([, paths]) => paths,
  );
  const paths = [...new Set([...byCategory, ...byKeyword])];

  // Nothing specific to say: send the reader to the index rather than guess.
  const links = (paths.length ? paths : ["/services"])
    .map((path) => linkFor(path) ?? { href: path, label: "Counselling & assessment services" })
    .slice(0, limit);
  return links;
}

/** The posts a service page should point at, most recent first. */
export function postsForService(
  service: Pick<Service, "slug"> | "astrology-tarot",
  posts: PublicPost[],
  limit = 3,
): PublicPost[] {
  const path =
    service === "astrology-tarot" ? REFLECTIVE_PATH : servicePath(service.slug);
  return posts
    .filter((post) => servicesForPost(post, 3).some((link) => link.href === path))
    .slice(0, limit);
}

/* ── Post → post ──────────────────────────────────────────────────── */

/**
 * Other posts worth reading next: same category first, then anything that
 * leads to the same service, then simply the most recent.
 */
export function rankRelatedPosts(
  current: PublicPost,
  candidates: PublicPost[],
  limit = 3,
): PublicPost[] {
  const mine = new Set(servicesForPost(current, 3).map((link) => link.href));
  const score = (post: PublicPost) => {
    let value = 0;
    if (post.category && post.category === current.category) value += 2;
    if (servicesForPost(post, 3).some((link) => mine.has(link.href))) value += 1;
    return value;
  };
  return candidates
    .filter((post) => post.slug !== current.slug)
    .map((post, index) => ({ post, index, value: score(post) }))
    .sort((a, b) => b.value - a.value || a.index - b.index) // stable: keep recency
    .slice(0, limit)
    .map(({ post }) => post);
}

/* ── Text → glossary ──────────────────────────────────────────────── */

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** "Overthinking (rumination)" → "Overthinking": the part people actually write. */
const headword = (term: string) => term.replace(/\s*\(.*?\)\s*/g, " ").trim();

/**
 * Glossary terms a piece of writing actually uses, most-used first — so an
 * article about boundaries offers the "Boundaries" and "People-pleasing"
 * definitions. Works on HTML or plain text.
 */
export function glossaryMentionedIn(text: string, limit = 4): GlossaryEntry[] {
  const plain = text.replace(/<[^>]*>/g, " ");
  return glossaryEntries
    .map((entry) => {
      const word = headword(entry.term);
      // "Counselling vs. psychotherapy" is a comparison, not a phrase anyone
      // writes into an article — it would never match, so skip it outright.
      if (/\bvs\.?\b/i.test(word)) return { entry, hits: 0 };
      const hits = plain.match(new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi"))?.length ?? 0;
      return { entry, hits };
    })
    .filter(({ hits }) => hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
