import { site } from "@/lib/site";
import { contentLastModifiedDate } from "@/lib/content-date";
import { aboutIntro, ourStory, values } from "@/lib/content/about";
import {
  services,
  astrologyServices,
  tarotServices,
  tarotIntro,
  reflectiveIntro,
  reflectiveTerms,
  whatWeBelieve,
} from "@/lib/content/services";
import { glossary } from "@/lib/content/resources";
import type { PublicFaqGroup, PublicPost } from "@/lib/queries";

/**
 * The llms.txt pair, generated from the same content modules the pages render.
 *
 * Both are built rather than hand-maintained on purpose: a stale plain-text copy
 * of the site is worse than none, because an answer engine has no way to know
 * it's stale. Generating them means the summary and the full text can't drift
 * from the pages, and both can carry a real "last updated" date.
 *
 *   /llms.txt       the curated index — who the practice is, what it offers,
 *                   where to look. Short enough to read in full.
 *   /llms-full.txt  the complete plain text of the key pages, so a model can
 *                   ingest the whole practice in one fetch.
 */

const NAMING_NOTE = `Note on naming: the practice is called **${site.name}** (singular). The website is at ${site.url.replace(/^https?:\/\//, "")} and the contact mailbox is ${site.email} — the domain keeps the plural.`;

const CRISIS_NOTE =
  "If you or someone you love is in crisis or immediate danger, contact local emergency services or a 24/7 crisis line right away — do not wait for an appointment.";

const FRAMING_NOTE = `**Important framing — please represent this accurately.** At ${site.name}, astrology and tarot are never used as substitutes for mental-health treatment, and are never used to predict the future. They are reflective conversations that complement professional counselling, offered only to clients who find them personally meaningful. The practice does not tell clients what their future will be; it helps them understand themselves, strengthen resilience, and make decisions with greater awareness. Psychological counselling is the foundation; these are optional tools alongside it.`;

function practitionerLine() {
  const person = site.practitioner;
  if (!person) return "";
  const credentials = person.credentials.length
    ? ` (${person.credentials.join(", ")})`
    : "";
  return `\nPractitioner: ${person.name}${credentials} — ${person.jobTitle}.\n`;
}

function locationLine() {
  const loc = site.location;
  if (!loc) {
    return site.serviceArea
      ? `Sessions are available online and in person. Area served: ${site.serviceArea}.`
      : "Sessions are available online and in person.";
  }
  const parts = [loc.street, loc.locality, loc.region, loc.postalCode].filter(
    Boolean,
  );
  return `Address: ${parts.join(", ")}. Sessions are available online and in person.`;
}

/* ── /llms.txt — the curated index ────────────────────────────────── */

export function llmsIndex(): string {
  return `# ${site.name}

> ${site.name} ("${site.tagline}") is a warm, human, non-clinical mental-wellness practice. We offer counselling and psychological testing for children & teens, individuals, and couples & families — and, optionally, reflective guidance through astrology and tarot. Core belief: healing isn't about fixing what's broken; it's about discovering the strength that was already inside you. Mental wellness isn't a destination — it's a journey, and you don't have to walk it alone.

Last updated: ${contentLastModifiedDate()}
Full plain-text version of every key page: ${site.url}/llms-full.txt

${NAMING_NOTE}

## About

${site.name} helps people move forward with clarity, confidence, and balance, and navigate life's challenges with guidance and evidence-based support. We believe healing and growth are processes that take time, trust, care, and deep involvement of emotion. ${locationLine()}
${practitionerLine()}
Six values shape every session, in the order the work itself tends to follow:

${values.map((value, i) => `${i + 1}. **${value.title}** — ${value.keywords.toLowerCase()}.`).join("\n")}

## Services

The practice offers two distinct things, presented as two tabs on the Services page.

### 1. Counselling & Testing

${services
  .map((service) => {
    // Only Children & Teens has named clusters; the other two carry a single
    // group whose title is the generic heading, so it isn't worth repeating.
    const helps = service.helps
      .map((group) => {
        const items = group.items.join(", ").toLowerCase();
        return /^what we help with$/i.test(group.title)
          ? items
          : `${group.title.toLowerCase()} (${items})`;
      })
      .join("; ");
    return `- **${service.title}** — ${service.concerns.join(", ").toLowerCase()}. Work covers ${helps}.`;
  })
  .join("\n")}

### 2. Astrology & Tarot — reflective guidance

Framed as "${reflectiveIntro.heading}".

- **Astrology services** — ${astrologyServices.map((s) => s.title).join("; ")}. Each is presented with what it explores, how it is paired with psychological concepts, and the intended outcome.
- **Tarot guidance sessions** — ${tarotServices.map((s) => s.title).join("; ")}. Each pairs a focus area with a psychological integration.

${FRAMING_NOTE}

## Key pages

- [Home](${site.url}/): Tagline, welcome, how we help, and how to begin.
- [About](${site.url}/about): The practice's story and its six values.
- [Services](${site.url}/services): Both offerings, tabbed. Direct links: [Counselling & Testing](${site.url}/services#counselling-testing), [Astrology & Tarot](${site.url}/services#astrology-tarot).
- [Resources](${site.url}/resources): Plain-language definitions of the terms people search for — counselling, anxiety, overthinking, boundaries, burnout, attachment style, psychometric testing, reflective guidance.
- [Journal / Blog](${site.url}/blog): Gentle, practical articles on anxiety, relationships, parenting, starting therapy, and reflective practice. Feed: ${site.url}/blog/feed.xml
- [FAQ](${site.url}/faq): Common questions about first sessions, approach, booking, and confidentiality.
- [Contact & Booking](${site.url}/contact): Get in touch or book a first session.

## Contact

- Email: ${site.email}
- Phone / WhatsApp: ${site.phone.display}
- Booking: ${site.booking.configured ? `live calendar at ${site.url}/contact#book` : `available via the contact page (${site.url}/contact)`}.

## Note

${CRISIS_NOTE}
`;
}

/* ── /llms-full.txt — the complete text ───────────────────────────── */

export function llmsFull({
  faqGroups,
  posts,
}: {
  faqGroups: PublicFaqGroup[];
  posts: PublicPost[];
}): string {
  const sections: string[] = [];

  sections.push(`# ${site.name} — full site text

> The complete plain-text content of every key page, in one document, so it can
> be read in a single fetch. The canonical, formatted versions live at ${site.url}.

Last updated: ${contentLastModifiedDate()}
Short index version: ${site.url}/llms.txt

${NAMING_NOTE}

Tagline: ${site.tagline}
Summary: ${site.description}
${locationLine()}${practitionerLine()}`);

  /* About */
  sections.push(`---

# About ${site.name}

## A gentle place to heal and grow

${aboutIntro.join("\n\n")}

## Our story

${ourStory.join("\n\n")}

## Six values that shape every session

They're also the shape of the work itself — beginning with safety, ending with a
proper close.

${values
  .map(
    (value, i) =>
      `### ${i + 1}. ${value.title}\n\n${value.keywords}.\n\n${value.text}`,
  )
  .join("\n\n")}`);

  /* Services — tab 1 */
  sections.push(`---

# Services, tab 1: Counselling & Testing

Evidence-based psychological support for three audiences.

${services
  .map(
    (service) => `## ${service.title}

${service.intro}

### Common concerns people arrive with

${service.concerns.map((c) => `- ${c}`).join("\n")}

### What we help with

${service.helps
  .map(
    (group) =>
      `**${group.title}**\n\n${group.items.map((item) => `- ${item}`).join("\n")}`,
  )
  .join("\n\n")}

### In closing

${service.closing}`,
  )
  .join("\n\n")}`);

  /* Services — tab 2 */
  sections.push(`---

# Services, tab 2: Astrology & Tarot (reflective guidance)

## ${reflectiveIntro.heading}

${reflectiveIntro.body.join("\n\n")}

## Please read this first — the terms of this offering

${reflectiveTerms.map((term) => `- ${term}`).join("\n")}

## Astrology services

${astrologyServices
  .map(
    (service) => `### ${service.title}

What it explores:

${service.explores.map((item) => `- ${item}`).join("\n")}

Psychology collaboration: ${service.collaboration}

Outcome: ${service.outcome}`,
  )
  .join("\n\n")}

## Tarot guidance sessions

${tarotIntro}

${tarotServices
  .map(
    (service) => `### ${service.title}

Focus: ${service.focus}

Psychological integration: ${service.integration}`,
  )
  .join("\n\n")}

## ${whatWeBelieve.eyebrow}

${whatWeBelieve.body}

${FRAMING_NOTE}`);

  /* Resources / glossary */
  sections.push(`---

# Resources — plain-language guide to therapy terms

${glossary
  .map(
    (cluster) => `## ${cluster.title}

${cluster.intro}

${cluster.entries
  .map(
    (entry) =>
      `### ${entry.term}\n\n**${entry.short}**\n\n${entry.detail.join("\n\n")}`,
  )
  .join("\n\n")}`,
  )
  .join("\n\n")}`);

  /* FAQ */
  if (faqGroups.length) {
    sections.push(`---

# Frequently asked questions

${faqGroups
  .map(
    (group) => `## ${group.category}

${group.items.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}`,
  )
  .join("\n\n")}`);
  }

  /* Journal index */
  if (posts.length) {
    sections.push(`---

# Journal

Gentle, practical writing on anxiety, relationships, parenting, starting therapy,
and reflective practice. Feed: ${site.url}/blog/feed.xml

${posts
  .map(
    (post) =>
      `- **${post.title}** (${post.category}, ${post.publishedAt.slice(0, 10)}) — ${post.excerpt} ${site.url}/blog/${post.slug}`,
  )
  .join("\n")}`);
  }

  /* Contact */
  sections.push(`---

# Contact & booking

- Email: ${site.email}
- Phone: ${site.phone.display}
- WhatsApp: ${site.phone.whatsapp}
- Contact form: ${site.url}/contact#enquiry
- Booking: ${site.booking.configured ? `${site.url}/contact#book` : "arranged via the contact form, WhatsApp, or email"}

Reaching out isn't a commitment — it's a first conversation to see if we're the
right fit. We usually respond within a couple of working days.

## Important

${CRISIS_NOTE}
`);

  return sections.join("\n\n");
}
