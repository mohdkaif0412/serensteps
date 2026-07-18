export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

/**
 * Anonymized sample testimonials for Phase 2. Identities are intentionally
 * generic — real client stories must never be published without written consent.
 */
export const testimonials: Testimonial[] = [
  {
    name: "R.",
    role: "Individual client",
    quote:
      "I arrived feeling completely stuck. Little by little, I started to understand myself instead of fighting myself. For the first time in years, I feel like I can breathe.",
  },
  {
    name: "M. & J.",
    role: "Couple",
    quote:
      "We'd stopped really hearing each other. These sessions gave us a way back to the same side of the table — calmer, kinder, and honestly closer than we've been in a long time.",
  },
  {
    name: "A parent",
    role: "Parent of a teen",
    quote:
      "My daughter finally had somewhere that felt like hers. She's lighter now, more open with us, and slowly finding her confidence again. I'm so grateful.",
  },
  {
    name: "S.",
    role: "Individual client",
    quote:
      "Warm, patient, and never rushed. I never felt judged — just gently helped to find my own footing, one step at a time.",
  },
];
