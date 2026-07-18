/**
 * Central site configuration — brand, contact details, navigation.
 * Keep copy and links here so pages stay declarative and easy to update.
 */

export const site = {
  name: "Serene Steps",
  tagline: "Healing, one step at a time.",
  description:
    "Serene Steps is a warm, human mental-wellness practice offering therapy for children & teens, individuals, and couples & families. We walk alongside you, one gentle step at a time.",
  url: "https://serenesteps.net",
  email: "hello@serenesteps.net",
  phone: "",
  // Cal.com booking link (username/event). Swappable for Calendly via env.
  calcomLink: process.env.NEXT_PUBLIC_CALCOM_LINK ?? "serene-steps/intro-call",
  // Whether a real booking link is configured (controls live embed vs. placeholder).
  calcomConfigured: Boolean(process.env.NEXT_PUBLIC_CALCOM_LINK),
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
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
