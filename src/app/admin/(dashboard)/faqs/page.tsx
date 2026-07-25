import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { Flash } from "@/components/admin/Flash";
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
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:bg-forest/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New FAQ
          </Link>
        }
      />

      {faqs.length ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                {group.category}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper shadow-soft">
                <ul className="divide-y divide-sage-deep/15">
                  {group.items.map((faq) => (
                    <li
                      key={faq.id}
                      className="flex items-center gap-4 px-5 py-4"
                    >
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
                      <div className="flex shrink-0 items-center gap-1">
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
        <div className="rounded-2xl border border-dashed border-sage-deep/40 bg-paper/60 p-12 text-center">
          <h2 className="font-display text-xl text-forest">No FAQs yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Add answers to the questions visitors ask most.
          </p>
          <Link
            href="/admin/faqs/new"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper hover:bg-forest/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New FAQ
          </Link>
        </div>
      )}
    </>
  );
}
