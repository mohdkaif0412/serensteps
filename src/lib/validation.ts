import { z } from "zod";
import {
  BOOKING_STATUSES,
  SESSION_MODES,
} from "@/lib/booking/constants";

/** Concern types offered on the contact form (matches ContactSubmission.concern). */
export const CONCERN_OPTIONS = [
  "Children & Teens",
  "Individual",
  "Couples & Family",
  "Other",
] as const;

// ─── Shared field rules ─────────────────────────────────────────
//
// Defined once and reused by every form — the contact page, the booking flow,
// and the server actions behind both — so a rule can never be enforced in one
// place and not the other.

/**
 * Email. Trimmed and lowercased *before* the format check, so a pasted
 * " Jordan@Example.COM " is accepted and stored as `jordan@example.com`.
 * Storing one canonical form matters here: `Client` is matched by email, and
 * two casings of the same address would otherwise become two clients.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please enter a valid email address").max(160));

const PHONE_MESSAGE = "Please enter a 10-digit mobile number";

/**
 * People write numbers however they like — "+91 70067 88155", "070067-88155",
 * "(700) 678 8155". Rejecting those for cosmetic reasons would be a bad way to
 * greet someone who is already finding it hard to ask for help. So strip the
 * punctuation and any country/trunk prefix first, then require exactly ten
 * digits — and store that clean form, which is what `tel:` links need.
 */
const normalisePhone = (value: string) =>
  value.replace(/[\s()\-.]/g, "").replace(/^(?:\+?91|0)/, "");

const isTenDigits = (value: string) => /^\d{10}$/.test(value);

/** A number that must be there and must be right. */
export const phoneSchema = z
  .string()
  .trim()
  .transform(normalisePhone)
  .refine(isTenDigits, PHONE_MESSAGE);

/** The same rule, but a blank field is fine. */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .transform((value) => (value ? normalisePhone(value) : ""))
  .refine((value) => value === "" || isTenDigits(value), PHONE_MESSAGE)
  .optional();

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(100),
  email: emailSchema,
  phone: optionalPhoneSchema,
  concern: z.enum(CONCERN_OPTIONS, {
    message: "Please choose the option that fits best",
  }),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail helps us help you")
    .max(2000, "Please keep your message under 2000 characters"),
  // Honeypot — real people leave this empty; bots tend to fill it.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Admin content schemas ──────────────────────────────────────

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const POST_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const postSchema = z.object({
  title: z.string().trim().min(3, "Please give the post a title").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "A web address (slug) is required")
    .max(160)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  excerpt: optionalText(300),
  content: z.string().min(1, "The post needs some content"),
  coverImage: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  category: optionalText(60),
  status: z.enum(POST_STATUSES),
  seoTitle: optionalText(160),
  seoDescription: optionalText(300),
  publishedAt: optionalText(40),
});
export type PostInput = z.infer<typeof postSchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(4, "Please enter the question").max(240),
  answer: z.string().trim().min(4, "Please enter the answer").max(3000),
  category: optionalText(60),
  order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});
export type FaqInput = z.infer<typeof faqSchema>;

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Please add a name or label").max(80),
  role: optionalText(80),
  quote: z.string().trim().min(4, "Please add the quote").max(1000),
  order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ─── Booking ────────────────────────────────────────────────────
//
// Error messages here are read by someone who may already be finding it hard to
// ask for help. Keep them gentle and specific — never "invalid input".

/** What a visitor sends when requesting a session. */
export const bookingSchema = z
  .object({
    sessionTypeSlug: z.string().trim().min(1, "Please choose a type of session"),
    mode: z.enum(SESSION_MODES, {
      message: "Please choose how you'd like to meet",
    }),
    /** ISO instant of the chosen slot, re-checked against real availability. */
    startsAt: z.iso.datetime({ message: "Please choose a time that suits you" }),
    name: z.string().trim().min(2, "Please tell us your name").max(100),
    email: emailSchema,
    phone: optionalPhoneSchema,
    firstTime: z.boolean(),
    concern: z.enum(CONCERN_OPTIONS).optional(),
    message: z
      .string()
      .trim()
      .max(2000, "Please keep this under 2000 characters")
      .optional(),
    consent: z.literal(true, {
      message: "Please confirm you're happy for us to contact you",
    }),
    // Honeypot — same trick as the contact form.
    website: z.string().max(0).optional(),
  })
  // A phone session with no number to call is the one combination that can't
  // work, so the field stops being optional the moment that mode is chosen.
  .refine((data) => data.mode !== "PHONE" || isTenDigits(data.phone ?? ""), {
    path: ["phone"],
    message: "We'll need a 10-digit number to call you on",
  });
export type BookingInput = z.infer<typeof bookingSchema>;

/** Cancelling from the client's own booking link. */
export const cancelBookingSchema = z.object({
  token: z.string().trim().min(1),
  reason: z.string().trim().max(500).optional(),
});

// ─── Booking admin schemas ──────────────────────────────────────

export const sessionTypeSchema = z.object({
  name: z.string().trim().min(2, "Please name this session type").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "A web address (slug) is required")
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  blurb: optionalText(400),
  durationMin: z.coerce
    .number()
    .int()
    .min(5, "Sessions need to be at least 5 minutes")
    .max(480, "That's longer than a working day"),
  bufferMin: z.coerce.number().int().min(0).max(240),
  modes: z
    .array(z.enum(SESSION_MODES))
    .min(1, "Choose at least one way this session can be held"),
  price: optionalText(40),
  order: z.coerce.number().int().min(0).max(9999),
  active: z.boolean(),
});
export type SessionTypeInput = z.infer<typeof sessionTypeSchema>;

export const availabilityRuleSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    startMinute: z.coerce.number().int().min(0).max(1439),
    endMinute: z.coerce.number().int().min(1).max(1440),
    active: z.boolean(),
  })
  .refine((data) => data.endMinute > data.startMinute, {
    path: ["endMinute"],
    message: "The finish time needs to be after the start time",
  });
export type AvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;

export const availabilityExceptionSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a date"),
    blocked: z.boolean(),
    startMinute: z.coerce.number().int().min(0).max(1439).optional(),
    endMinute: z.coerce.number().int().min(1).max(1440).optional(),
    note: optionalText(160),
  })
  .refine(
    (data) =>
      data.blocked ||
      (data.startMinute !== undefined &&
        data.endMinute !== undefined &&
        data.endMinute > data.startMinute),
    {
      path: ["endMinute"],
      message: "Extra hours need a start and a finish time",
    },
  );
export type AvailabilityExceptionInput = z.infer<
  typeof availabilityExceptionSchema
>;

export const confirmBookingSchema = z.object({
  id: z.string().trim().min(1),
  meetingLink: z
    .string()
    .trim()
    .url("Enter a full link, starting with https://")
    .max(500)
    .optional()
    .or(z.literal("")),
  locationNote: optionalText(500),
  adminNote: optionalText(2000),
});

export const rescheduleBookingSchema = z.object({
  id: z.string().trim().min(1),
  startsAt: z.iso.datetime({ message: "Please choose a new time" }),
});

export const bookingStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(BOOKING_STATUSES),
  reason: optionalText(500),
});

export const clientNotesSchema = z.object({
  id: z.string().trim().min(1),
  notes: optionalText(5000),
});
