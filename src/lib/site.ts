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
 */

const fromEnv = (value: string | undefined) => value?.trim() ?? "";

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

export const site = {
  name: "Serene Step",
  tagline: "Step into your light",
  description:
    "Serene Step is a warm, human mental-wellness practice offering counselling and psychological testing for children & teens, individuals, and couples & families — plus optional reflective guidance through astrology and tarot. We walk alongside you, one gentle step at a time.",
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
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
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
