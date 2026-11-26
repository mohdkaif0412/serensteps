/**
 * Copy for the 404 page. Kept here with the rest of the site's words so the
 * component stays purely presentational (see AGENTS.md → content conventions).
 */
export const notFoundPage = {
  metaTitle: "Page not found",
  eyebrow: "Error 404 · Page not found",
  /** Rendered as "{lead} <em>{emphasis}</em>". */
  title: {
    lead: "This path seems to have",
    emphasis: "wandered off.",
  },
  intro:
    "The page you were looking for may have moved, been renamed, or never quite existed. That's alright — every journey has a few unexpected turns. Let's find your next step together.",
  missedLabel: "You tried",
  primary: { label: "Back to home", href: "/" },
  suggestionsTitle: "Or pick up from here",
  suggestions: [
    {
      href: "/services",
      label: "Services",
      text: "Counselling for children, individuals, couples and families.",
      icon: "services",
    },
    {
      href: "/resources",
      label: "Resources",
      text: "Gentle tools and exercises you can start with today.",
      icon: "resources",
    },
    {
      href: "/blog",
      label: "Blog",
      text: "Reflections on anxiety, relationships, growth and more.",
      icon: "blog",
    },
    {
      href: "/contact",
      label: "Contact",
      text: "A real person reads every message. Say hello.",
      icon: "contact",
    },
  ],
  support: {
    lead: "Looking for support right now?",
    text: "Write to us at",
    or: "or call",
  },
} as const;

export type NotFoundSuggestionIcon =
  (typeof notFoundPage.suggestions)[number]["icon"];
