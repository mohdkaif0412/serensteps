import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { bookingConfig } from "@/lib/booking/config";
import { formatLongDate, formatTime } from "@/lib/booking/timezone";

/**
 * The client list as a CSV, so the practice's own records aren't locked inside
 * this app. Sits under /admin so the middleware gate applies, with `requireAdmin`
 * as the real check behind it.
 */

/** RFC 4180: quote everything, double any inner quote. */
function cell(value: string | number | null | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireAdmin();

  const clients = await prisma.client.findMany({
    include: { bookings: { orderBy: { startsAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  const { timeZone } = bookingConfig;
  const rows = [
    ["Name", "Email", "Phone", "Sessions", "Latest session", "First seen", "Notes"]
      .map(cell)
      .join(","),
    ...clients.map((client) => {
      const latest = client.bookings.find(
        (booking) => booking.status !== "CANCELLED",
      );
      return [
        cell(client.name),
        cell(client.email),
        cell(client.phone),
        cell(client.bookings.filter((b) => b.status !== "CANCELLED").length),
        cell(
          latest
            ? `${formatLongDate(latest.startsAt, timeZone)} ${formatTime(latest.startsAt, timeZone)}`
            : "",
        ),
        cell(formatLongDate(client.createdAt, timeZone)),
        cell(client.notes),
      ].join(",");
    }),
  ];

  // The BOM keeps Excel from mangling non-ASCII names.
  return new Response(`﻿${rows.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="serene-step-clients.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
