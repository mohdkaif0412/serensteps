import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Inbox, Mail, Phone, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { NotesForm } from "@/components/admin/NotesForm";
import { BookingRow } from "@/components/admin/BookingRow";
import { deleteClient } from "@/actions/admin-booking";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Client" };

export default async function AdminClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      bookings: {
        include: { client: true, sessionType: true },
        orderBy: { startsAt: "desc" },
      },
    },
  });
  if (!client) notFound();

  // Anything they sent through the contact form, matched on the address they
  // booked with — the two arrive separately but they're the same person.
  const submissions = await prisma.contactSubmission.findMany({
    where: { email: { equals: client.email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

  const kept = client.bookings.filter((booking) => booking.status !== "CANCELLED");

  return (
    <>
      <Link
        href="/admin/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All clients
      </Link>

      <AdminPageHeader
        title={client.name}
        description={`${kept.length} session${kept.length === 1 ? "" : "s"} · with you since ${formatDate(client.createdAt)}`}
        action={
          <ActionButton
            action={deleteClient}
            id={client.id}
            title="Delete this client"
            confirm="Delete this client and every booking of theirs? This cannot be undone — use it for a deletion request, not for tidying up."
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 sm:w-auto"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete client
          </ActionButton>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section>
            <h2 className="mb-3 font-display text-xl text-forest">Sessions</h2>
            {client.bookings.length ? (
              <div className="space-y-3">
                {client.bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-sage-deep/20 bg-paper p-5 text-sm text-muted">
                No sessions booked yet.
              </p>
            )}
          </section>

          {submissions.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-forest">
                <Inbox className="size-5 text-mint-deep" strokeWidth={1.75} aria-hidden="true" />
                Messages from this address
              </h2>
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <article
                    key={submission.id}
                    className="rounded-2xl border border-sage-deep/20 bg-paper p-4 shadow-soft sm:p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                      {submission.concern && (
                        <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-forest">
                          {submission.concern}
                        </span>
                      )}
                      <span>{formatDate(submission.createdAt)}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-forest/90">
                      {submission.message}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
            <h2 className="font-display text-xl text-forest">Contact</h2>
            <div className="mt-4 space-y-2 text-sm">
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-3 rounded-xl border border-sage-deep/20 p-3 transition-colors hover:bg-sage/20"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sage text-forest">
                  <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="min-w-0 break-all text-forest">{client.email}</span>
              </a>
              {client.phone && (
                <a
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-3 rounded-xl border border-sage-deep/20 p-3 transition-colors hover:bg-sage/20"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sage text-forest">
                    <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-forest">{client.phone}</span>
                </a>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
            <h2 className="font-display text-xl text-forest">Private notes</h2>
            <p className="mt-1 text-sm text-muted">
              Only you can see these. Keep them brief — this isn&rsquo;t a clinical
              record system.
            </p>
            <div className="mt-5">
              <NotesForm
                target="client"
                id={client.id}
                defaultValue={client.notes ?? ""}
                label="Notes about this client"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
