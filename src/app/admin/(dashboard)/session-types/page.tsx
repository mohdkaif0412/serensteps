import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { Flash } from "@/components/admin/Flash";
import {
  deleteSessionType,
  toggleSessionTypeActive,
} from "@/actions/admin-booking";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";

export const metadata = { title: "Session types" };

const flashMessages: Record<string, string> = { saved: "Session type saved" };

export default async function AdminSessionTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>;
}) {
  const { flash } = await searchParams;
  const types = await prisma.sessionType.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <>
      <Flash message={flash ? flashMessages[flash] : undefined} />
      <AdminPageHeader
        title="Session types"
        description="What people can book, how long it takes, and how it can be held."
        action={
          <Link
            href="/admin/session-types/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            New session type
          </Link>
        }
      />

      {types.length ? (
        <div className="overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper shadow-soft">
          <ul className="divide-y divide-sage-deep/15">
            {types.map((type) => (
              <li
                key={type.id}
                className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-sage/10 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-forest">{type.name}</p>
                    {!type.active && (
                      <span className="rounded-full bg-sage px-2 py-0.5 text-xs text-muted">
                        Not bookable
                      </span>
                    )}
                    {type.price && (
                      <span className="rounded-full bg-mint-soft px-2 py-0.5 text-xs font-medium text-forest">
                        {type.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {type.durationMin} min
                    {type.bufferMin > 0 ? ` (+${type.bufferMin} quiet)` : ""} ·{" "}
                    {type.modes
                      .map((mode) => MODE_LABELS[mode as SessionMode])
                      .join(", ")}{" "}
                    · {type._count.bookings} booked
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                  <ActionButton
                    action={toggleSessionTypeActive}
                    id={type.id}
                    title={type.active ? "Stop offering" : "Offer again"}
                    toastMessage={type.active ? "No longer bookable" : "Bookable again"}
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                  >
                    {type.active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </ActionButton>
                  <Link
                    href={`/admin/session-types/${type.id}/edit`}
                    title="Edit"
                    aria-label="Edit"
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <ActionButton
                    action={deleteSessionType}
                    id={type.id}
                    title="Delete"
                    confirm={
                      type._count.bookings > 0
                        ? "This has sessions booked against it, so it will be hidden from the booking page rather than deleted — that keeps everyone's history intact. Continue?"
                        : "Delete this session type? This cannot be undone."
                    }
                    toastMessage="Done"
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </ActionButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="Nothing bookable yet"
          description="Add what people can book — a first conversation, a counselling hour, an assessment."
          action={{ href: "/admin/session-types/new", label: "New session type", icon: Plus }}
        />
      )}
    </>
  );
}
