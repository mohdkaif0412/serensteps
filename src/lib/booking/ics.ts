/**
 * A minimal RFC 5545 calendar file, so a confirmed session lands in the client's
 * own calendar with one tap. Attached to the confirmation email and served at
 * /api/bookings/[token]/calendar.ics.
 *
 * Deliberately hand-rolled: one VEVENT with no recurrence, no alarms and no
 * attendee list doesn't justify a dependency.
 */

import { site } from "@/lib/site";

export type IcsEvent = {
  /** Stable across updates — reusing it lets a client's calendar update in place. */
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description?: string;
  /** A physical address, or the meeting link for an online session. */
  location?: string;
  url?: string;
  /** Bumped on every change so calendars accept the newer version. */
  sequence?: number;
  cancelled?: boolean;
};

/** "20260812T100000Z" */
function toIcsDate(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold at 75 octets, as the spec requires for long descriptions. */
function fold(line: string) {
  if (line.length <= 75) return line;
  const chunks: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    chunks.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) chunks.push(` ${rest}`);
  return chunks.join("\r\n");
}

export function buildIcs(event: IcsEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeText(site.name)}//Booking//EN`,
    "CALSCALE:GREGORIAN",
    `METHOD:${event.cancelled ? "CANCEL" : "REQUEST"}`,
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    `SEQUENCE:${event.sequence ?? 0}`,
    `STATUS:${event.cancelled ? "CANCELLED" : "CONFIRMED"}`,
    `SUMMARY:${escapeText(event.summary)}`,
    `ORGANIZER;CN=${escapeText(site.name)}:mailto:${site.email}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.url) lines.push(`URL:${escapeText(event.url)}`);

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.map(fold).join("\r\n");
}
