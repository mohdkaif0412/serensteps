import { getBookingByToken } from "@/lib/queries";
import { buildIcs } from "@/lib/booking/ics";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";
import { site } from "@/lib/site";

/**
 * The "add to calendar" link from a confirmation email and from the client's own
 * booking page. The token is the credential — a wrong one is a plain 404, with
 * no hint that a booking exists.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const booking = await getBookingByToken(token);
  if (!booking) return new Response("Not found", { status: 404 });

  const manageUrl = `${site.url}/booking/${booking.token}`;
  const ics = buildIcs({
    uid: `${booking.id}@serenesteps.net`,
    start: booking.startsAt,
    end: booking.endsAt,
    summary: `${booking.sessionType.name} — ${site.name}`,
    description: `${MODE_LABELS[booking.mode as SessionMode]}. Manage your booking: ${manageUrl}`,
    location: booking.meetingLink || booking.locationNote || undefined,
    url: manageUrl,
    cancelled: booking.status === "CANCELLED",
    sequence: booking.status === "CANCELLED" ? 1 : 0,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="serene-steps-session.ics"',
      // Personal, and it changes whenever the practitioner does.
      "Cache-Control": "private, no-store",
    },
  });
}
