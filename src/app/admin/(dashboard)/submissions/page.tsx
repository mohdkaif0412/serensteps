import { Mail, Phone, Check, Trash2, Circle } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import {
  toggleSubmissionHandled,
  deleteSubmission,
} from "@/actions/submissions";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages" };

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  const unhandled = submissions.filter((s) => !s.handled).length;

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description={
          unhandled > 0
            ? `${unhandled} new message${unhandled === 1 ? "" : "s"} waiting for a reply.`
            : "Messages sent through the contact form."
        }
      />

      {submissions.length ? (
        <div className="space-y-4">
          {submissions.map((s) => (
            <article
              key={s.id}
              className={cn(
                "rounded-2xl border bg-paper p-5 shadow-soft sm:p-6",
                s.handled
                  ? "border-sage-deep/20"
                  : "border-mint-deep/60 ring-1 ring-mint-deep/25",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!s.handled && (
                      <Circle
                        className="size-2 shrink-0 fill-mint-deep text-mint-deep"
                        aria-label="New"
                      />
                    )}
                    <h2 className="font-display text-lg text-forest">{s.name}</h2>
                    {s.concern && (
                      <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-forest">
                        {s.concern}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    <a
                      href={`mailto:${s.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-forest"
                    >
                      <Mail className="size-3.5" aria-hidden="true" />
                      {s.email}
                    </a>
                    {s.phone && (
                      <a
                        href={`tel:${s.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-forest"
                      >
                        <Phone className="size-3.5" aria-hidden="true" />
                        {s.phone}
                      </a>
                    )}
                    <span>{formatDate(s.createdAt)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <ActionButton
                    action={toggleSubmissionHandled}
                    id={s.id}
                    title={s.handled ? "Mark as new" : "Mark as handled"}
                    toastMessage={s.handled ? "Marked as new" : "Marked as handled"}
                    className={cn(
                      "grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest",
                      s.handled && "bg-sage/60 text-forest",
                    )}
                  >
                    <Check className="size-4" />
                  </ActionButton>
                  <ActionButton
                    action={deleteSubmission}
                    id={s.id}
                    title="Delete"
                    confirm="Delete this message? This cannot be undone."
                    toastMessage="Message deleted"
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </ActionButton>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line border-t border-sage-deep/15 pt-4 leading-relaxed text-forest/90">
                {s.message}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-sage-deep/40 bg-paper/60 p-12 text-center">
          <h2 className="font-display text-xl text-forest">No messages yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            When someone sends a message through the contact form, it will appear
            here.
          </p>
        </div>
      )}
    </>
  );
}
