/**
 * The bookable offerings the practice starts with, and the working hours behind
 * them. Like posts / FAQs / testimonials, this file is the *seed*: once the
 * database is populated the admin owns these records and edits them at
 * /admin/session-types. Adding an entry here brings it to an existing database
 * on the next `npm run db:seed`; editing one here does NOT overwrite an admin's
 * changes (seeding is additive, matched on slug).
 *
 * `price` is display-only — no payment is taken online — and is deliberately
 * left blank until the client confirms their fees. A blank price simply isn't
 * shown, which is better than a guessed one.
 */

import type { SessionMode } from "@/lib/booking/constants";

export type SeedSessionType = {
  slug: string;
  name: string;
  blurb: string;
  durationMin: number;
  bufferMin: number;
  modes: SessionMode[];
  price?: string;
};

export const seedSessionTypes: SeedSessionType[] = [
  {
    slug: "intro-call",
    name: "Free intro call",
    blurb:
      "A short, no-pressure conversation to see if working together feels right. No commitment beyond this call.",
    durationMin: 15,
    bufferMin: 10,
    modes: ["PHONE", "ONLINE"],
    price: "Free",
  },
  {
    slug: "individual-counselling",
    name: "Individual counselling",
    blurb:
      "A confidential hour for adults — anxiety, overthinking, burnout, grief, self-worth, or simply feeling stuck.",
    durationMin: 50,
    bufferMin: 15,
    modes: ["ONLINE", "IN_PERSON", "PHONE"],
  },
  {
    slug: "children-teens",
    name: "Children & teens session",
    blurb:
      "A safe, warm space for young people, with parents involved as much or as little as helps.",
    durationMin: 50,
    bufferMin: 15,
    modes: ["ONLINE", "IN_PERSON"],
  },
  {
    slug: "couples-family",
    name: "Couples & family session",
    blurb:
      "A longer session so everyone gets heard — communication, recurring conflict, parenting, rebuilding trust.",
    durationMin: 75,
    bufferMin: 15,
    modes: ["ONLINE", "IN_PERSON"],
  },
  {
    slug: "career-assessment",
    name: "Career & psychometric assessment",
    blurb:
      "Psychometric testing, a written report, and a one-to-one session to talk through what it means.",
    durationMin: 90,
    bufferMin: 20,
    modes: ["ONLINE", "IN_PERSON"],
  },
  {
    slug: "reflective-guidance",
    name: "Reflective guidance (astrology & tarot)",
    blurb:
      "A reflective conversation using astrology or tarot as a mirror — never as prediction, and never in place of therapy.",
    durationMin: 60,
    bufferMin: 15,
    modes: ["ONLINE", "IN_PERSON"],
  },
];

/**
 * Opening hours to start from: Monday–Saturday, 10:00–18:00, expressed in
 * minutes from midnight in the practice timezone. The admin edits these at
 * /admin/availability.
 */
export const seedAvailability = [1, 2, 3, 4, 5, 6].map((weekday) => ({
  weekday,
  startMinute: 10 * 60,
  endMinute: 18 * 60,
}));
