export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

/**
 * Testimonials seeded into a fresh database. Deliberately empty.
 *
 * This list used to hold four invented "sample" quotes, which the seed
 * published and the homepage and service pages displayed as if they were from
 * real clients. On a mental-health site that misleads the very people the
 * practice is trying to earn the trust of, so it must only ever contain real
 * words from real clients, published with their written consent — and they are
 * better entered through /admin/testimonials than hardcoded here.
 *
 * Every testimonial section renders nothing when the list is empty, and there
 * is intentionally no Review/AggregateRating markup for them either.
 */
export const testimonials: Testimonial[] = [];
