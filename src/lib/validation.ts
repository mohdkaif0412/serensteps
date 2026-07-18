import { z } from "zod";

/** Concern types offered on the contact form (matches ContactSubmission.concern). */
export const CONCERN_OPTIONS = [
  "Children & Teens",
  "Individual",
  "Couples & Family",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(100),
  email: z.email("Please enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .max(30, "That number looks a little long")
    .optional(),
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
