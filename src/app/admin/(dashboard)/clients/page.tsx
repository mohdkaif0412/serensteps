import Link from "next/link";
import { Download, Mail, Phone, Search, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Flash } from "@/components/admin/Flash";
import { adminField } from "@/components/admin/form-ui";
import { ACTIVE_STATUSES } from "@/lib/booking/constants";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Clients" };

const flashMessages: Record<string, string> = { deleted: "Client deleted" };

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; flash?: string }>;
}) {
  const { q, flash } = await searchParams;
  const query = q?.trim() ?? "";

  const clients = await prisma.client.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      bookings: {
        select: { id: true, startsAt: true, status: true },
        orderBy: { startsAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <>
      <Flash message={flash ? flashMessages[flash] : undefined} />
      <AdminPageHeader
        title="Clients"
        description="Everyone who has booked through the website, and their history with you."
        action={
          // A plain anchor on purpose: this is a file download from a route
          // handler, and <Link> would try to client-navigate to it.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/admin/clients/export"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sage-deep/30 px-5 py-2.5 text-sm font-medium text-forest transition hover:bg-sage/50 sm:w-auto"
          >
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </a>
        }
      />

      <form className="mb-6 flex gap-2" role="search">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email, or phone"
            aria-label="Search clients"
            className={`${adminField} pl-10`}
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-forest-deep"
        >
          Search
        </button>
      </form>

      {clients.length ? (
        <div className="overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper shadow-soft">
          <ul className="divide-y divide-sage-deep/15">
            {clients.map((client) => {
              const kept = client.bookings.filter((booking) =>
                (ACTIVE_STATUSES as string[]).includes(booking.status),
              );
              const last = kept[0];
              return (
                <li key={client.id}>
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-sage/10 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-forest">{client.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted">
                        {/* A long address is one unbreakable word — without
                            break-all it widens the row on a phone. */}
                        <span className="inline-flex max-w-full items-center gap-1.5 break-all">
                          <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="size-3.5" aria-hidden="true" />
                            {client.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm text-muted sm:text-right">
                      <p className="text-forest">
                        {kept.length} session{kept.length === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs">
                        {last
                          ? `Latest ${formatDate(last.startsAt)}`
                          : `Added ${formatDate(client.createdAt)}`}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={query ? "Nobody matches that search" : "No clients yet"}
          description={
            query
              ? "Try part of a name, an email address, or a phone number."
              : "As soon as someone books a session, their details are saved here."
          }
        />
      )}
    </>
  );
}
