import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, CircleHelp } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { Flash } from "@/components/admin/Flash";
import { EmptyState } from "@/components/admin/EmptyState";
import { deleteFaq, toggleFaqPublished } from "@/actions/faqs";

export const metadata = { title: "FAQs" };

const flashMessages: Record<string, string> = { saved: "FAQ saved" };

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>;
}) {
  const { flash } = await searchParams;
  const faqs = await prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  // Group by category, preserving order.
  const groups: { category: string; items: typeof faqs }[] = [];
  for (const faq of faqs) {
    const key = faq.category ?? "Uncategorised";
    let group = groups.find((g) => g.category === key);
    if (!group) {
      group = { category: key, items: [] };
      groups.push(group);
    }
    group.items.push(faq);
  }

  return (
    <>
      <Flash message={flash ? flashMessages[flash] : undefined} />
      <AdminPageHeader
        title="FAQs"
        description="Answer common questions. Group them by category and set the order they appear in."
        action={
          <Link
            href="/admin/faqs/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            New FAQ
          </Link>
        }
      />

      {faqs.length ? (
        <div className="space-y-6 sm:space-y-8">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {group.category}
                <span className="h-px flex-1 bg-sage-deep/20" aria-hidden="true" />
                <span className="text-xs font-normal normal-case tracking-normal text-muted/70">
                  {group.items.length}
                </span>
              </h2>
              <div className="overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper shadow-soft">
                <ul className="divide-y divide-sage-deep/15">
                  {group.items.map((faq) => (
                    <li
                      key={faq.id}
                      className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-sage/10 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage/70 text-xs font-medium text-forest">
                          {faq.order}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-forest">
                            {faq.question}
                          </p>
                          {!faq.published && (
                            <span className="text-xs text-mint-deep">Hidden</span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                        <ActionButton
                          action={toggleFaqPublished}
                          id={faq.id}
                          title={faq.published ? "Hide" : "Show"}
                          toastMessage={faq.published ? "Hidden" : "Published"}
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                        >
                          {faq.published ? (
                            <Eye className="size-4" />
                          ) : (
                            <EyeOff className="size-4" />
                          )}
                        </ActionButton>
                        <Link
                          href={`/admin/faqs/${faq.id}/edit`}
                          title="Edit"
                          aria-label="Edit"
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <ActionButton
                          action={deleteFaq}
                          id={faq.id}
                          title="Delete"
                          confirm="Delete this FAQ? This cannot be undone."
                          toastMessage="FAQ deleted"
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </ActionButton>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CircleHelp}
          title="No FAQs yet"
          description="Add answers to the questions visitors ask most."
          action={{ href: "/admin/faqs/new", label: "New FAQ", icon: Plus }}
        />
      )}
    </>
  );
}
