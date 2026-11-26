/**
 * The five emails a booking can send: request received (client), new request
 * (practice), confirmed, rescheduled, cancelled.
 *
 * Tone matters more than usual here — the person on the other end may have found
 * it hard to press the button at all. Warm, short, and always with a way to
 * reach a human.
 *
 * Every send is best-effort (see `sendEmail`), so a booking is never lost to a
 * mail hiccup.
 */

import type { Booking, Client, SessionType } from "@/generated/prisma";
import {
  emailButton,
  emailLayout,
  emailQuote,
  emailRow,
  escapeHtml,
  sendEmail,
} from "@/lib/email";
import { bookingConfig } from "@/lib/booking/config";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";
import { buildIcs } from "@/lib/booking/ics";
import { formatLongDate, formatTime, timeZoneLabel } from "@/lib/booking/timezone";
import { site } from "@/lib/site";

export type BookingWithDetails = Booking & {
  client: Client;
  sessionType: SessionType;
};

const { timeZone } = bookingConfig;

/** "Tuesday, 12 August 2026 · 3:30 pm – 4:20 pm (GMT+5:30)" */
export function describeWhen(booking: BookingWithDetails) {
  return `${formatLongDate(booking.startsAt, timeZone)} · ${formatTime(
    booking.startsAt,
    timeZone,
  )} – ${formatTime(booking.endsAt, timeZone)} (${timeZoneLabel(booking.startsAt, timeZone)})`;
}

/** What the client needs in order to actually turn up. */
export function describeWhere(booking: BookingWithDetails) {
  const mode = booking.mode as SessionMode;
  if (mode === "ONLINE") {
    return booking.meetingLink
      ? `<a href="${escapeHtml(booking.meetingLink)}" style="color:#2E8F6B;">${escapeHtml(booking.meetingLink)}</a>`
      : "A private video link will reach you before your session.";
  }
  if (mode === "IN_PERSON") {
    return escapeHtml(
      booking.locationNote ||
        [site.location?.street, site.location?.locality]
          .filter(Boolean)
          .join(", ") ||
        "We'll send you the address before your session.",
    );
  }
  return escapeHtml(
    booking.client.phone
      ? `We'll call you on ${booking.client.phone}.`
      : "We'll call you at your chosen time.",
  );
}

const manageUrl = (booking: BookingWithDetails) =>
  `${site.url}/booking/${booking.token}`;

function detailTable(booking: BookingWithDetails) {
  return `<table style="width:100%;border-collapse:collapse;">
    ${emailRow("Session", escapeHtml(booking.sessionType.name))}
    ${emailRow("When", escapeHtml(describeWhen(booking)))}
    ${emailRow("How", escapeHtml(MODE_LABELS[booking.mode as SessionMode]))}
    ${emailRow("Where", describeWhere(booking))}
  </table>`;
}

function icsAttachment(booking: BookingWithDetails, cancelled = false) {
  const ics = buildIcs({
    uid: `${booking.id}@serenesteps.net`,
    start: booking.startsAt,
    end: booking.endsAt,
    summary: `${booking.sessionType.name} — ${site.name}`,
    description: `${MODE_LABELS[booking.mode as SessionMode]}. Manage your booking: ${manageUrl(booking)}`,
    location: booking.meetingLink || booking.locationNote || undefined,
    url: manageUrl(booking),
    sequence: cancelled ? 1 : 0,
    cancelled,
  });
  return [{ filename: "serene-steps-session.ics", content: ics }];
}

// ─── On request ──────────────────────────────────────────────────

export async function sendBookingRequestEmails(booking: BookingWithDetails) {
  await Promise.all([
    // To the client — an acknowledgement, not a confirmation. Be exact about
    // that: a "confirmed" they didn't get would be a wasted journey.
    sendEmail({
      to: booking.client.email,
      subject: `We've got your request — ${booking.sessionType.name}`,
      html: emailLayout({
        heading: "Thank you for reaching out",
        intro: `Hi ${booking.client.name.split(" ")[0]}, we've received your request and we're looking at it now. You'll hear from us within a couple of working days to confirm the time — nothing is booked until then.`,
        body: `${detailTable(booking)}
          <p style="margin:26px 0 0;">${emailButton(manageUrl(booking), "View or cancel this request")}</p>`,
        footNote:
          "Plans change, and that's completely fine — use the link above, or just reply to this email.",
      }),
    }),
    // To the practice — everything needed to decide, in one glance.
    sendEmail({
      to: bookingConfig.notifyTo,
      replyTo: booking.client.email,
      subject: `New session request — ${booking.client.name}, ${booking.sessionType.name}`,
      html: emailLayout({
        heading: "New session request",
        intro: "Confirm or reschedule it from the admin.",
        body: `<table style="width:100%;border-collapse:collapse;">
            ${emailRow("Name", escapeHtml(booking.client.name))}
            ${emailRow("Email", escapeHtml(booking.client.email))}
            ${booking.client.phone ? emailRow("Phone", escapeHtml(booking.client.phone)) : ""}
            ${emailRow("Session", escapeHtml(booking.sessionType.name))}
            ${emailRow("When", escapeHtml(describeWhen(booking)))}
            ${emailRow("How", escapeHtml(MODE_LABELS[booking.mode as SessionMode]))}
            ${emailRow("First time", booking.firstTime ? "Yes" : "No — been before")}
            ${booking.concern ? emailRow("About", escapeHtml(booking.concern)) : ""}
          </table>
          ${booking.message ? emailQuote(booking.message) : ""}
          <p style="margin:26px 0 0;">${emailButton(`${site.url}/admin/bookings`, "Open the admin")}</p>`,
      }),
    }),
  ]);
}

// ─── On confirmation / change ────────────────────────────────────

export async function sendBookingConfirmedEmail(booking: BookingWithDetails) {
  await sendEmail({
    to: booking.client.email,
    subject: `Confirmed — ${booking.sessionType.name}, ${formatLongDate(booking.startsAt, timeZone)}`,
    html: emailLayout({
      heading: "Your session is confirmed",
      intro: `Hi ${booking.client.name.split(" ")[0]}, we're looking forward to seeing you. Here are the details — the calendar file attached will add it to your diary.`,
      body: `${detailTable(booking)}
        <p style="margin:26px 0 0;">${emailButton(manageUrl(booking), "View your booking")}</p>`,
      footNote:
        "If you need to move or cancel, please let us know as early as you can so the time can go to someone else.",
    }),
    attachments: icsAttachment(booking),
  });
}

export async function sendBookingRescheduledEmail(booking: BookingWithDetails) {
  await sendEmail({
    to: booking.client.email,
    subject: `A new time for your session — ${formatLongDate(booking.startsAt, timeZone)}`,
    html: emailLayout({
      heading: "Your session has moved",
      intro: `Hi ${booking.client.name.split(" ")[0]}, your session has been rescheduled. Here's the new time — do tell us if it doesn't work and we'll find another.`,
      body: `${detailTable(booking)}
        <p style="margin:26px 0 0;">${emailButton(manageUrl(booking), "View your booking")}</p>`,
    }),
    attachments: icsAttachment(booking),
  });
}

export async function sendBookingCancelledEmail(
  booking: BookingWithDetails,
  cancelledByClient: boolean,
) {
  const tasks = [
    sendEmail({
      to: booking.client.email,
      subject: `Your session on ${formatLongDate(booking.startsAt, timeZone)} is cancelled`,
      html: emailLayout({
        heading: "Your session is cancelled",
        intro: cancelledByClient
          ? `Hi ${booking.client.name.split(" ")[0]}, we've cancelled the session below as you asked. Whenever you're ready, the door is open.`
          : `Hi ${booking.client.name.split(" ")[0]}, we're sorry — we've had to cancel the session below. Please do book another time, or reply and we'll find one together.`,
        body: `${detailTable(booking)}
          ${booking.cancelledReason ? emailQuote(booking.cancelledReason) : ""}
          <p style="margin:26px 0 0;">${emailButton(`${site.url}/book`, "Book another time")}</p>`,
      }),
      attachments: icsAttachment(booking, true),
    }),
  ];

  // The practice only needs telling when it wasn't their own doing.
  if (cancelledByClient) {
    tasks.push(
      sendEmail({
        to: bookingConfig.notifyTo,
        subject: `Cancelled — ${booking.client.name}, ${formatLongDate(booking.startsAt, timeZone)}`,
        html: emailLayout({
          heading: "A booking was cancelled",
          intro: `${booking.client.name} cancelled from their booking link. The slot is free again.`,
          body: `${detailTable(booking)}
            ${booking.cancelledReason ? emailQuote(booking.cancelledReason) : ""}`,
        }),
      }),
    );
  }

  await Promise.all(tasks);
}
