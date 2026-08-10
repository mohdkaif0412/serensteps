import { prisma, withDbFallback } from "@/lib/db";
import { postCover } from "@/lib/images";
import { readingMinutes } from "@/lib/utils";
import { bookingConfig } from "@/lib/booking/config";
import { ACTIVE_STATUSES, type SessionMode } from "@/lib/booking/constants";
import { buildSlots, type BusyInterval, type DaySlots } from "@/lib/booking/slots";
import type { Post as DbPost, SessionType } from "@/generated/prisma";

// Every read here is wrapped in `withDbFallback` because these queries also run
// during `next build` (prerendering, sitemap, feed, generateStaticParams). With
// a database present nothing changes; without one the build still completes and
// the content arrives at runtime. See src/lib/db.ts.

// ─── View models the public components consume ───────────────────

export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  publishedAt: string; // ISO
  updatedAt: string; // ISO — real edit time, for dateModified / sitemap
  readingMinutes: number;
  wordCount: number;
  content: string; // HTML
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PublicTestimonial = {
  name: string;
  role: string | null;
  quote: string;
};

export type PublicFaqGroup = {
  category: string;
  items: { question: string; answer: string }[];
};

/** Just what the sitemap needs — cheap projection, no content column. */
export type PostSitemapEntry = {
  slug: string;
  updatedAt: Date;
  coverImage: string;
  title: string;
};

function wordsIn(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function toPublicPost(post: DbPost): PublicPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category ?? "Journal",
    coverImage: post.coverImage || postCover(post.slug),
    coverAlt: `Cover image for “${post.title}”`,
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    readingMinutes: readingMinutes(post.content),
    wordCount: wordsIn(post.content),
    content: post.content,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  };
}

const PUBLISHED = { status: "PUBLISHED" as const };

// ─── Posts ───────────────────────────────────────────────────────

export const BLOG_PAGE_SIZE = 9;

export async function getPublishedPosts({
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
}: { page?: number; pageSize?: number } = {}) {
  return withDbFallback(
    async () => {
      const [total, posts] = await Promise.all([
        prisma.post.count({ where: PUBLISHED }),
        prisma.post.findMany({
          where: PUBLISHED,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);
      return {
        posts: posts.map(toPublicPost),
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        page,
      };
    },
    { posts: [] as PublicPost[], total: 0, totalPages: 1, page },
  );
}

export async function getLatestPosts(take = 3): Promise<PublicPost[]> {
  return withDbFallback(async () => {
    const posts = await prisma.post.findMany({
      where: PUBLISHED,
      orderBy: { publishedAt: "desc" },
      take,
    });
    return posts.map(toPublicPost);
  }, []);
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PublicPost | null> {
  return withDbFallback(async () => {
    const post = await prisma.post.findFirst({ where: { slug, ...PUBLISHED } });
    return post ? toPublicPost(post) : null;
  }, null);
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  return withDbFallback(async () => {
    const posts = await prisma.post.findMany({
      where: PUBLISHED,
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  }, []);
}

/** Slug + real edit time + cover, for `sitemap.ts` image entries. */
export async function getPostSitemapEntries(): Promise<PostSitemapEntry[]> {
  return withDbFallback(async () => {
    const posts = await prisma.post.findMany({
      where: PUBLISHED,
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, updatedAt: true, coverImage: true },
    });
    return posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      updatedAt: p.updatedAt,
      coverImage: p.coverImage || postCover(p.slug),
    }));
  }, []);
}

// ─── FAQs ────────────────────────────────────────────────────────

export async function getPublishedFaqGroups(): Promise<PublicFaqGroup[]> {
  return withDbFallback(async () => {
    const faqs = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    const groups: PublicFaqGroup[] = [];
    for (const faq of faqs) {
      const category = faq.category ?? "General";
      let group = groups.find((g) => g.category === category);
      if (!group) {
        group = { category, items: [] };
        groups.push(group);
      }
      group.items.push({ question: faq.question, answer: faq.answer });
    }
    return groups;
  }, []);
}

// ─── Testimonials ────────────────────────────────────────────────

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  return withDbFallback(async () => {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return testimonials.map((t) => ({
      name: t.name,
      role: t.role,
      quote: t.quote,
    }));
  }, []);
}

// ─── Booking ─────────────────────────────────────────────────────

export type PublicSessionType = {
  slug: string;
  name: string;
  blurb: string;
  durationMin: number;
  modes: SessionMode[];
  /** Display only — no payment is taken online. Empty when unset. */
  price: string;
};

function toPublicSessionType(type: SessionType): PublicSessionType {
  return {
    slug: type.slug,
    name: type.name,
    blurb: type.blurb ?? "",
    durationMin: type.durationMin,
    modes: type.modes as SessionMode[],
    price: type.price ?? "",
  };
}

/** The offerings shown in the booking flow, in the practitioner's order. */
export async function getActiveSessionTypes(): Promise<PublicSessionType[]> {
  return withDbFallback(async () => {
    const types = await prisma.sessionType.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return types.map(toPublicSessionType);
  }, []);
}

/**
 * Every time already spoken for, padded by the buffer of whatever is booked
 * there. Anything cancelled or marked no-show frees its slot again.
 */
async function collectBusy(from: Date, until: Date): Promise<BusyInterval[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      startsAt: { gte: new Date(from.getTime() - 24 * 3_600_000), lte: until },
    },
    select: {
      id: true,
      startsAt: true,
      endsAt: true,
      sessionType: { select: { bufferMin: true } },
    },
  });
  return bookings.map((booking) => ({
    startsAt: booking.startsAt,
    endsAt: new Date(
      booking.endsAt.getTime() + booking.sessionType.bufferMin * 60_000,
    ),
  }));
}

/**
 * Offerable start times for a session type, day by day across the horizon.
 *
 * `excludeBookingId` lets the admin reschedule a booking into a window that its
 * own current slot would otherwise appear to block.
 */
export async function computeSlotsFor(
  type: Pick<SessionType, "durationMin" | "bufferMin">,
  options: { excludeBookingId?: string; from?: Date } = {},
): Promise<DaySlots[]> {
  const from = options.from ?? new Date();
  const until = new Date(
    from.getTime() + (bookingConfig.horizonDays + 2) * 86_400_000,
  );

  const [rules, exceptions, busyAll] = await Promise.all([
    prisma.availabilityRule.findMany({ where: { active: true } }),
    prisma.availabilityException.findMany({
      where: { date: { gte: new Date(from.getTime() - 86_400_000), lte: until } },
    }),
    collectBusy(from, until),
  ]);

  const busy = options.excludeBookingId
    ? await excludeBooking(busyAll, options.excludeBookingId)
    : busyAll;

  return buildSlots({
    timeZone: bookingConfig.timeZone,
    rules,
    exceptions,
    busy,
    durationMin: type.durationMin,
    bufferMin: type.bufferMin,
    slotStepMin: bookingConfig.slotStepMin,
    leadTimeHours: bookingConfig.leadTimeHours,
    horizonDays: bookingConfig.horizonDays,
    from,
  });
}

/** Drop one booking's own interval from the busy list, matched on its times. */
async function excludeBooking(busy: BusyInterval[], bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { startsAt: true },
  });
  if (!booking) return busy;
  return busy.filter(
    (interval) => interval.startsAt.getTime() !== booking.startsAt.getTime(),
  );
}

/**
 * One booking, looked up by the unguessable token in the client's email. This
 * is the only unauthenticated read of personal data on the site — the token is
 * the credential, so it is never listed, linked, or put in a sitemap.
 */
export async function getBookingByToken(token: string) {
  if (!token.trim()) return null;
  return withDbFallback(
    () =>
      prisma.booking.findUnique({
        where: { token },
        include: { client: true, sessionType: true },
      }),
    null,
  );
}

/** Public slot lookup by slug. Empty when the type is retired or unknown. */
export async function getAvailableSlots(slug: string): Promise<DaySlots[]> {
  return withDbFallback(async () => {
    const type = await prisma.sessionType.findFirst({
      where: { slug, active: true },
      select: { durationMin: true, bufferMin: true },
    });
    if (!type) return [];
    return computeSlotsFor(type);
  }, []);
}
