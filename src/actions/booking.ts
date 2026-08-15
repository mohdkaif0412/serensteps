"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { computeSlotsFor, getAvailabilityGrid } from "@/lib/queries";
import { isOfferedSlot, EMPTY_SLOT_GRID } from "@/lib/booking/slots";
import { ACTIVE_STATUSES } from "@/lib/booking/constants";
import {
  sendBookingCancelledEmail,
  sendBookingRequestEmails,
  type BookingWithDetails,
} from "@/lib/booking/emails";
import { bookingSchema, cancelBookingSchema } from "@/lib/validation";
import type { SlotGrid } from "@/lib/booking/slots";

export type BookingResult =
  | { ok: true; token: string }
  | { ok: false; error: string; slotTaken?: boolean };

const GENERIC_ERROR =
  "Something went wrong on our side. Please try again, or WhatsApp us and we'll book you in ourselves.";

/**
 * The availability chart for a session type — free, booked and unavailable
 * times alike. Called by the flow whenever the chosen type changes.
 *
 * Deliberately the whole picture and not just the free times: someone looking
 * at an empty morning should be able to see whether it's taken or simply not a
 * day we work. No client identity is included — only that a time is spoken for.
 */
export async function fetchSlots(slug: string): Promise<SlotGrid> {
  if (typeof slug !== "string" || !slug.trim()) return EMPTY_SLOT_GRID;
  return getAvailabilityGrid(slug);
}

// ─── A light per-IP throttle ─────────────────────────────────────
//
// In-memory, so it resets on redeploy and doesn't span instances. That's fine:
// it exists to blunt an accidental double-submit or a crude script, not to be a
// security control — the honeypot and the slot re-check do the real work.

const RATE_LIMIT = { max: 6, windowMs: 60 * 60 * 1000 };
const recentRequests = new Map<string, number[]>();

async function isRateLimited() {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const hits = (recentRequests.get(ip) ?? []).filter(
    (at) => now - at < RATE_LIMIT.windowMs,
  );
  hits.push(now);
  recentRequests.set(ip, hits);
  // Keep the map from growing without bound on a long-lived instance.
  if (recentRequests.size > 5000) recentRequests.clear();
  return hits.length > RATE_LIMIT.max;
}

// ─── Requesting a session ────────────────────────────────────────

export async function requestBooking(input: unknown): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the details and try again." };
  }

  const { website, ...data } = parsed.data;
  // Honeypot: bots fill this. Look successful and drop it.
  if (website && website.length > 0) {
    return { ok: true, token: "" };
  }

  if (await isRateLimited()) {
    return {
      ok: false,
      error:
        "That's a few requests in a short time. Please give it a moment, or WhatsApp us directly.",
    };
  }

  try {
    const sessionType = await prisma.sessionType.findFirst({
      where: { slug: data.sessionTypeSlug, active: true },
    });
    if (!sessionType) {
      return {
        ok: false,
        error: "That session type isn't available any more. Please choose another.",
      };
    }
    if (!sessionType.modes.includes(data.mode)) {
      return {
        ok: false,
        error: "That session isn't offered that way. Please choose another option.",
      };
    }

    // Never trust the slot the browser sends: rebuild availability and check
    // the chosen time is genuinely on offer right now.
    const startsAt = new Date(data.startsAt);
    const days = await computeSlotsFor(sessionType);
    if (!isOfferedSlot(days, startsAt.toISOString())) {
      return {
        ok: false,
        slotTaken: true,
        error: "Sorry — that time has just been taken. Please pick another.",
      };
    }

    const endsAt = new Date(startsAt.getTime() + sessionType.durationMin * 60_000);
    const email = data.email.trim().toLowerCase();

    const booking = await prisma.$transaction(
      async (tx) => {
        // Last-moment race guard. Serializable makes two simultaneous requests
        // for the same slot resolve to one winner; the loser lands in the
        // catch below and is told the time went.
        const clash = await tx.booking.findFirst({
          where: {
            status: { in: ACTIVE_STATUSES },
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
          },
          select: { id: true },
        });
        if (clash) throw new SlotTakenError();

        const client = await tx.client.upsert({
          where: { email },
          update: {
            name: data.name,
            ...(data.phone?.trim() ? { phone: data.phone.trim() } : {}),
          },
          create: {
            email,
            name: data.name,
            phone: data.phone?.trim() || null,
          },
        });

        return tx.booking.create({
          data: {
            token: randomBytes(16).toString("base64url"),
            clientId: client.id,
            sessionTypeId: sessionType.id,
            startsAt,
            endsAt,
            mode: data.mode,
            status: "PENDING",
            firstTime: data.firstTime,
            concern: data.concern ?? null,
            message: data.message?.trim() || null,
          },
          include: { client: true, sessionType: true },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    await sendBookingRequestEmails(booking);

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/clients");
    return { ok: true, token: booking.token };
  } catch (error) {
    if (error instanceof SlotTakenError || isSerializationFailure(error)) {
      return {
        ok: false,
        slotTaken: true,
        error: "Sorry — that time has just been taken. Please pick another.",
      };
    }
    console.error("[booking] request failed:", error);
    return { ok: false, error: GENERIC_ERROR };
  }
}

class SlotTakenError extends Error {}

/** Postgres 40001, surfaced when two Serializable transactions collide. */
function isSerializationFailure(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2034" ||
      (error.meta?.code as string | undefined) === "40001")
  );
}

// ─── Cancelling from the client's own link ───────────────────────

export async function cancelBookingByToken(
  input: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = cancelBookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please try again." };

  try {
    const booking = await prisma.booking.findUnique({
      where: { token: parsed.data.token },
      include: { client: true, sessionType: true },
    });
    if (!booking) return { ok: false, error: "We couldn't find that booking." };
    if (booking.status === "CANCELLED") return { ok: true };
    if (booking.startsAt.getTime() < Date.now()) {
      return {
        ok: false,
        error: "That session has already passed, so there's nothing to cancel.",
      };
    }

    const updated: BookingWithDetails = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        cancelledReason: parsed.data.reason?.trim() || null,
      },
      include: { client: true, sessionType: true },
    });

    await sendBookingCancelledEmail(updated, true);

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    revalidatePath(`/booking/${parsed.data.token}`);
    return { ok: true };
  } catch (error) {
    console.error("[booking] cancel failed:", error);
    return { ok: false, error: GENERIC_ERROR };
  }
}
