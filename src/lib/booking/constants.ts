/**
 * Booking vocabulary, shared by the schema, the server actions, the public flow
 * and the admin. Client-safe: no server imports, so the chat widget and the
 * stepper can both pull the labels straight from here.
 *
 * Modes and statuses are stored as plain strings in Postgres rather than Prisma
 * enums — adding a status later shouldn't need a migration, and the Zod schemas
 * in `src/lib/validation.ts` are what actually guard the values.
 */

export const SESSION_MODES = ["ONLINE", "IN_PERSON", "PHONE"] as const;
export type SessionMode = (typeof SESSION_MODES)[number];

export const MODE_LABELS: Record<SessionMode, string> = {
  ONLINE: "Online video call",
  IN_PERSON: "In person",
  PHONE: "Phone or WhatsApp call",
};

/** One short line explaining what actually happens, used under each choice. */
export const MODE_BLURBS: Record<SessionMode, string> = {
  ONLINE: "We'll send you a private video link before your session.",
  IN_PERSON: "You'll get the address and directions once your time is confirmed.",
  PHONE: "We'll call you on the number you give us, at your chosen time.",
};

export const isSessionMode = (value: unknown): value is SessionMode =>
  typeof value === "string" && (SESSION_MODES as readonly string[]).includes(value);

export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Awaiting confirmation",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "Didn't attend",
};

/** Statuses that still occupy their slot — anything else frees the time again. */
export const ACTIVE_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
];
