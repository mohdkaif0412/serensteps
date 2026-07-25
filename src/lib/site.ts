/**
 * Central site configuration — brand, contact details, navigation.
 * Keep copy and links here so pages stay declarative and easy to update.
 *
 * Anything the owner might change without touching code is env-overridable
 * (all documented in `.env.example`). Set the var in your hosting dashboard
 * and it flows everywhere automatically:
 *
 *   NEXT_PUBLIC_SITE_URL       Canonical base URL (Vercel preview vs. real domain).
 *   NEXT_PUBLIC_CONTACT_EMAIL  Public contact address.
 *   NEXT_PUBLIC_CONTACT_PHONE  Local phone number, digits only.
 *   NEXT_PUBLIC_PHONE_COUNTRY  Dialling code for the WhatsApp link, digits only.
 *   NEXT_PUBLIC_CALCOM_LINK    Cal.com "username/event" link → live booking embed.
 *   NEXT_PUBLIC_CALENDLY_URL   Calendly URL (alternative to Cal.com).
 *   NEXT_PUBLIC_INSTAGRAM_URL  Social links. Leave a var unset to hide its icon.
 *   NEXT_PUBLIC_FACEBOOK_URL
 *
 * Real-world facts for local SEO and Person/author schema live here too, and
 * every one of them is *omitted* rather than guessed when unset — see the
 * `practitioner` and `location` blocks below.
 */

const fromEnv = (value: string | undefined) => value?.trim() ?? "";

/** Split a comma-separated env var into a clean list. */
const listFromEnv = (value: string | undefined) =>
  fromEnv(value)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const siteUrl = fromEnv(process.env.NEXT_PUBLIC_SITE_URL) || "https://serenesteps.net";
// NOTE: the display name is "Serene Step" (singular, per the logo) while the
// domain and mailbox remain serenesteps.net — that mismatch is intentional and
// confirmed; don't "fix" one to match the other.
const contactEmail =
  fromEnv(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "steps@serenesteps.net";

// Phone is stored as digits only; the display and link forms are derived below.
// Country code defaults to 91 (India) — override if that's ever wrong.
const phoneLocal = fromEnv(process.env.NEXT_PUBLIC_CONTACT_PHONE) || "7006788155";
const phoneCountry = fromEnv(process.env.NEXT_PUBLIC_PHONE_COUNTRY) || "91";
const phoneDigits = `${phoneCountry}${phoneLocal}`;

// Booking: Cal.com wins if both are set; either one enables the live calendar.
const calcomLink = fromEnv(process.env.NEXT_PUBLIC_CALCOM_LINK);
const calendlyUrl = fromEnv(process.env.NEXT_PUBLIC_CALENDLY_URL);
const bookingProvider: "calcom" | "calendly" | null = calcomLink
  ? "calcom"
  : calendlyUrl
    ? "calendly"
    : null;

/**
 * The named practitioner, for Person / article-author schema.
 *
 * Google and the answer engines both reward a health site that names a real,
 * credentialed expert — but a *guessed* name would be worse than none, so every
 * Person-shaped signal is skipped until NEXT_PUBLIC_PRACTITIONER_NAME is set.
 * Credentials are a comma-separated list, e.g. "M.Phil Clinical Psychology,
 * RCI-registered".
 */
const practitionerName = fromEnv(process.env.NEXT_PUBLIC_PRACTITIONER_NAME);
const practitioner = practitionerName
  ? {
      name: practitionerName,
      jobTitle:
        fromEnv(process.env.NEXT_PUBLIC_PRACTITIONER_TITLE) ||
        "Counselling Psychologist",
      credentials: listFromEnv(process.env.NEXT_PUBLIC_PRACTITIONER_CREDENTIALS),
    }
  : null;

/**
 * Physical location, for LocalBusiness rich results and local search.
 * A postal address is only emitted once the locality (city) is known — a
 * half-filled address is worse for local SEO than none at all. Leave unset for
 * an online-only practice; `areaServed` then carries the reach on its own.
 */
const addressLocality = fromEnv(process.env.NEXT_PUBLIC_ADDRESS_LOCALITY);
const location = addressLocality
  ? {
      street: fromEnv(process.env.NEXT_PUBLIC_ADDRESS_STREET),
      locality: addressLocality,
      region: fromEnv(process.env.NEXT_PUBLIC_ADDRESS_REGION),
      postalCode: fromEnv(process.env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE),
      /** ISO 3166-1 alpha-2. */
      country: fromEnv(process.env.NEXT_PUBLIC_ADDRESS_COUNTRY) || "IN",
      latitude: fromEnv(process.env.NEXT_PUBLIC_GEO_LAT),
      longitude: fromEnv(process.env.NEXT_PUBLIC_GEO_LNG),
      mapUrl: fromEnv(process.env.NEXT_PUBLIC_MAP_URL),
    }
  : null;

/**
 * Opening hours as `Day-Day HH:MM-HH:MM` entries, comma-separated —
 * e.g. "Mo-Fr 10:00-18:00, Sa 10:00-14:00". Omitted entirely when unset.
 */
const openingHours = listFromEnv(process.env.NEXT_PUBLIC_OPENING_HOURS);

/**
 * Where the practice works. Set NEXT_PUBLIC_SERVICE_AREA to a city or region
 * ("Srinagar, Jammu & Kashmir") and the location flows into the description,
 * page titles, keywords, the footer NAP block and JSON-LD in one move — which is
 * exactly the consistency local search rewards. Blank keeps everything
 * reach-neutral.
 */
const serviceArea = fromEnv(process.env.NEXT_PUBLIC_SERVICE_AREA);

const baseDescription =
  "Serene Step is a warm, human mental-wellness practice offering counselling and psychological testing for children & teens, individuals, and couples & families — plus optional reflective guidance through astrology and tarot. We walk alongside you, one gentle step at a time.";

export const site = {
  name: "Serene Step",
  tagline: "Step into your light",
  description: serviceArea
    ? `${baseDescription} Based in ${serviceArea}, with sessions online and in person.`
    : baseDescription,
  url: siteUrl,
  email: contactEmail,
  phone: {
    /** Digits only, with country code — for wa.me and tel: links. */
    digits: phoneDigits,
    /** How the number is written on the page. */
    display: phoneLocal,
    tel: `tel:+${phoneDigits}`,
    /** Click-to-chat. A prefilled note lowers the bar to that first message. */
    whatsapp: `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
      "Hi Serene Step, I'd like to know more about your sessions.",
    )}`,
  },
  /** Logo lockups, keyed by the surface they sit on. */
  logo: {
    /** Dark-green ink — for paper and other light surfaces. */
    onLight: "/brand/serene-step-forest.png",
    /** Mint ink — for deep forest surfaces. */
    onDark: "/brand/serene-step-mint.png",
    /** The wave-of-faces mark on its own. */
    markOnLight: "/brand/mark-forest.png",
    markOnDark: "/brand/mark-mint.png",
    /** Intrinsic size of the lockups, for next/image. */
    width: 650,
    height: 260,
  },
  booking: {
    provider: bookingProvider,
    /** Whether a real calendar is connected (live embed vs. graceful fallback). */
    configured: bookingProvider !== null,
    calcomLink,
    calendlyUrl,
  },
  socials: {
    // Empty string = no account yet → the icon is hidden and the URL is left
    // out of JSON-LD. Set the env var to switch it on.
    instagram: fromEnv(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebook: fromEnv(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  },
  /** The named expert behind the practice, or `null` until confirmed. */
  practitioner,
  /** Postal address + geo, or `null` for an online-only practice. */
  location,
  openingHours,
  serviceArea,
  /** Schema.org priceRange, e.g. "₹₹". Omitted from JSON-LD when blank. */
  priceRange: fromEnv(process.env.NEXT_PUBLIC_PRICE_RANGE),
  /**
   * Search-console ownership tokens. Server-only vars: they end up in a `<meta>`
   * tag rendered on the server, so they don't need the NEXT_PUBLIC_ prefix.
   */
  verification: {
    google: fromEnv(process.env.GOOGLE_SITE_VERIFICATION),
    bing: fromEnv(process.env.BING_SITE_VERIFICATION),
  },
  /**
   * Privacy-friendly analytics. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to switch the
   * (cookieless, no-personal-data) script on; leave it blank and nothing at all
   * is loaded. Self-hosters can point NEXT_PUBLIC_PLAUSIBLE_SRC at their own
   * instance — an Umami script URL works here too.
   */
  analytics: {
    plausibleDomain: fromEnv(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
    plausibleSrc:
      fromEnv(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC) ||
      "https://plausible.io/js/script.js",
  },
  /**
   * The practice's subject matter — one list, shared by root metadata keywords,
   * `knowsAbout` in JSON-LD, and blog keyword derivation.
   */
  topics: [
    "Therapy",
    "Counselling",
    "Anxiety",
    "Overthinking",
    "Depression",
    "Relationships",
    "Couples counselling",
    "Family counselling",
    "Trauma",
    "Grief and loss",
    "Boundaries",
    "Burnout",
    "Self-esteem",
    "Mental wellness",
    "Child and adolescent therapy",
    "Career counselling",
    "Psychometric and career assessment",
    "Astrology and tarot as reflective tools",
  ],
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/resources", label: "Resources" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];

/**
 * The single booking call-to-action used by every "Book"-style button sitewide.
 * When a real calendar is connected it reads "Book Now" and jumps to the live
 * embed (#book). Otherwise it reads "Request a session" and routes to the
 * contact form (#enquiry) — so nothing promises instant booking the site can't
 * yet deliver.
 */
export const bookingCta = {
  label: site.booking.configured ? "Book Now" : "Request a session",
  href: site.booking.configured ? "/contact#book" : "/contact#enquiry",
} as const;
