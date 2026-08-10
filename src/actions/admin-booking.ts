"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, type FormState } from "@/lib/admin-auth";
import { computeSlotsFor } from "@/lib/queries";
import { isOfferedSlot } from "@/lib/booking/slots";
import {
  sendBookingCancelledEmail,
  sendBookingConfirmedEmail,
  sendBookingRescheduledEmail,
} from "@/lib/booking/emails";
import {
  availabilityExceptionSchema,
  availabilityRuleSchema,
  bookingStatusSchema,
  clientNotesSchema,
  confirmBookingSchema,
  rescheduleBookingSchema,
  sessionTypeSchema,
} from "@/lib/validation";
import { SESSION_MODES } from "@/lib/booking/constants";

const withDetails = { include: { client: true, sessionType: true } } as const;

function revalidateBookings() {
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/clients");
  revalidatePath("/book");
}

// ─── Individual bookings ─────────────────────────────────────────

/**
 * Confirm a pending request. This is the moment the client is told their time
 * is real, so it's also where the meeting link or address is captured — the
 * confirmation email is worth little without it.
 */
export async function confirmBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = confirmBookingSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    meetingLink: formData.get("meetingLink")?.toString() ?? "",
    locationNote: formData.get("locationNote")?.toString() ?? "",
    adminNote: formData.get("adminNote")?.toString() ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, meetingLink, locationNote, adminNote } = parsed.data;
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      meetingLink: meetingLink || null,
      locationNote: locationNote || null,
      adminNote: adminNote || null,
      cancelledReason: null,
    },
    ...withDetails,
  });

  await sendBookingConfirmedEmail(booking);

  revalidateBookings();
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}

/** Move a booking to another time, checking the new slot is genuinely free. */
export async function rescheduleBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = rescheduleBookingSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    startsAt: formData.get("startsAt")?.toString() ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please choose a new time.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.booking.findUnique({
    where: { id: parsed.data.id },
    ...withDetails,
  });
  if (!existing) return { ok: false, error: "That booking no longer exists." };

  const startsAt = new Date(parsed.data.startsAt);
  const days = await computeSlotsFor(existing.sessionType, {
    excludeBookingId: existing.id,
  });
  if (!isOfferedSlot(days, startsAt.toISOString())) {
    return {
      ok: false,
      error:
        "That time isn't free — it's outside your hours, already booked, or inside the notice period.",
    };
  }

  const booking = await prisma.booking.update({
    where: { id: existing.id },
    data: {
      startsAt,
      endsAt: new Date(
        startsAt.getTime() + existing.sessionType.durationMin * 60_000,
      ),
      // Moving a cancelled booking brings it back as confirmed, not pending —
      // the practitioner chose the time, so there's nothing left to approve.
      status: "CONFIRMED",
    },
    ...withDetails,
  });

  await sendBookingRescheduledEmail(booking);

  revalidateBookings();
  revalidatePath(`/admin/bookings/${existing.id}`);
  return { ok: true };
}

/** Complete / no-show / cancel from the list, via ActionButton or a form. */
export async function setBookingStatus(formData: FormData) {
  await requireAdmin();

  const parsed = bookingStatusSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "",
    reason: formData.get("reason")?.toString() ?? "",
  });
  if (!parsed.success) return;

  const booking = await prisma.booking.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      ...(parsed.data.status === "CANCELLED"
        ? { cancelledReason: parsed.data.reason || null }
        : {}),
    },
    ...withDetails,
  });

  // Only a cancellation needs telling — nobody wants an email saying they
  // attended the session they just attended.
  if (parsed.data.status === "CANCELLED") {
    await sendBookingCancelledEmail(booking, false);
  }

  revalidateBookings();
  revalidatePath(`/admin/bookings/${parsed.data.id}`);
}

export async function saveBookingNote(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = formData.get("id")?.toString() ?? "";
  const note = (formData.get("adminNote")?.toString() ?? "").trim();
  if (!id) return { ok: false, error: "Something went wrong. Please try again." };

  await prisma.booking.update({
    where: { id },
    data: { adminNote: note || null },
  });
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}

export async function deleteBooking(formData: FormData) {
  await requireAdmin();
  await prisma.booking.delete({ where: { id: String(formData.get("id")) } });
  revalidateBookings();
}

// ─── Clients ─────────────────────────────────────────────────────

export async function saveClientNotes(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = clientNotesSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: "Please shorten the note and try again." };
  }

  await prisma.client.update({
    where: { id: parsed.data.id },
    data: { notes: parsed.data.notes || null },
  });
  revalidatePath(`/admin/clients/${parsed.data.id}`);
  return { ok: true };
}

/** Erase a client and everything booked under them — for a deletion request. */
export async function deleteClient(formData: FormData) {
  await requireAdmin();
  await prisma.client.delete({ where: { id: String(formData.get("id")) } });
  revalidateBookings();
  redirect("/admin/clients?flash=deleted");
}

// ─── Session types ───────────────────────────────────────────────

export async function saveSessionType(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = formData.get("id")?.toString() || null;

  const parsed = sessionTypeSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    blurb: formData.get("blurb")?.toString() ?? "",
    durationMin: formData.get("durationMin")?.toString() ?? "50",
    bufferMin: formData.get("bufferMin")?.toString() ?? "15",
    modes: SESSION_MODES.filter((mode) => formData.get(`mode-${mode}`) === "on"),
    price: formData.get("price")?.toString() ?? "",
    order: formData.get("order")?.toString() ?? "0",
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const d = parsed.data;
  const data = {
    name: d.name,
    slug: d.slug,
    blurb: d.blurb || null,
    durationMin: d.durationMin,
    bufferMin: d.bufferMin,
    modes: d.modes,
    price: d.price || null,
    order: d.order,
    active: d.active,
  };

  try {
    if (id) {
      await prisma.sessionType.update({ where: { id }, data });
    } else {
      await prisma.sessionType.create({ data });
    }
  } catch {
    return {
      ok: false,
      error: "That web address (slug) is already used by another session type.",
      fieldErrors: { slug: ["Already in use"] },
    };
  }

  revalidateBookings();
  revalidatePath("/admin/session-types");
  redirect("/admin/session-types?flash=saved");
}

export async function toggleSessionTypeActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const type = await prisma.sessionType.findUnique({ where: { id } });
  if (!type) return;
  await prisma.sessionType.update({
    where: { id },
    data: { active: !type.active },
  });
  revalidateBookings();
  revalidatePath("/admin/session-types");
}

/**
 * Only ever removable while nothing is booked against it — past sessions are
 * part of a client's history and must not vanish. Otherwise, deactivate.
 */
export async function deleteSessionType(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const bookings = await prisma.booking.count({ where: { sessionTypeId: id } });
  if (bookings > 0) {
    await prisma.sessionType.update({ where: { id }, data: { active: false } });
  } else {
    await prisma.sessionType.delete({ where: { id } });
  }
  revalidateBookings();
  revalidatePath("/admin/session-types");
}

// ─── Availability ────────────────────────────────────────────────

/**
 * The weekly editor posts every row at once — simplest thing that can't leave
 * half-saved hours behind, and the table is seven rows long.
 */
export async function saveAvailability(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const rules: { weekday: number; startMinute: number; endMinute: number; active: boolean }[] =
    [];

  for (let weekday = 0; weekday < 7; weekday++) {
    const active = formData.get(`active-${weekday}`) === "on";
    const start = formData.get(`start-${weekday}`)?.toString() ?? "";
    const end = formData.get(`end-${weekday}`)?.toString() ?? "";
    // A closed day simply has no rule — nothing to validate.
    if (!active) continue;

    const parsed = availabilityRuleSchema.safeParse({
      weekday,
      startMinute: timeToMinutes(start),
      endMinute: timeToMinutes(end),
      active: true,
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: `Please check the hours for ${DAY_NAMES[weekday]} — the finish time must be after the start.`,
      };
    }
    rules.push(parsed.data);
  }

  await prisma.$transaction([
    prisma.availabilityRule.deleteMany({}),
    ...(rules.length
      ? [prisma.availabilityRule.createMany({ data: rules })]
      : []),
  ]);

  revalidateBookings();
  revalidatePath("/admin/availability");
  return { ok: true };
}

export async function addAvailabilityException(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const blocked = formData.get("blocked") !== "off";
  const start = formData.get("startMinute")?.toString() ?? "";
  const end = formData.get("endMinute")?.toString() ?? "";

  const parsed = availabilityExceptionSchema.safeParse({
    date: formData.get("date")?.toString() ?? "",
    blocked,
    ...(blocked
      ? {}
      : { startMinute: timeToMinutes(start), endMinute: timeToMinutes(end) }),
    note: formData.get("note")?.toString() ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the date and hours.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.availabilityException.create({
    data: {
      // A date-only column: store it as midnight UTC so it reads back as the
      // same calendar day everywhere.
      date: new Date(`${parsed.data.date}T00:00:00.000Z`),
      blocked: parsed.data.blocked,
      startMinute: parsed.data.startMinute ?? null,
      endMinute: parsed.data.endMinute ?? null,
      note: parsed.data.note || null,
    },
  });

  revalidateBookings();
  revalidatePath("/admin/availability");
  return { ok: true };
}

export async function deleteAvailabilityException(formData: FormData) {
  await requireAdmin();
  await prisma.availabilityException.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidateBookings();
  revalidatePath("/admin/availability");
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** "10:00" → 600. Returns -1 for anything unparseable, which then fails Zod. */
function timeToMinutes(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return -1;
  return Number(match[1]) * 60 + Number(match[2]);
}
