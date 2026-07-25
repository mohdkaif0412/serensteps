import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Info } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { Flash } from "@/components/admin/Flash";
import {
  deleteTestimonial,
  toggleTestimonialPublished,
} from "@/actions/testimonials";

export const metadata = { title: "Testimonials" };

const flashMessages: Record<string, string> = { saved: "Testimonial saved" };

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>;
}) {
  const { flash } = await searchParams;
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <Flash message={flash ? flashMessages[flash] : undefined} />
      <AdminPageHeader
        title="Testimonials"
        description="Share gentle words from those you've walked alongside."
        action={
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:bg-forest/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New testimonial
          </Link>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-mint/40 bg-mint/10 p-4 text-sm text-forest">
        <Info className="mt-0.5 size-5 shrink-0 text-mint-deep" aria-hidden="true" />
        <p>
          Keep these anonymous. Never publish a client&rsquo;s real name or
          identifying details without their written consent.
        </p>
      </div>

      {testimonials.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-forest">{t.name}</p>
                  {t.role && <p className="text-xs text-muted">{t.role}</p>}
                </div>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage/70 text-xs font-medium text-forest">
                  {t.order}
                </span>
              </div>
              <blockquote className="flex-1 font-display text-[0.95rem] italic leading-relaxed text-forest/90">
                {`“${t.quote}”`}
              </blockquote>
              <div className="mt-4 flex items-center justify-between border-t border-sage-deep/15 pt-3">
                <span className="text-xs text-muted">
                  {t.published ? "Visible on site" : "Hidden"}
                </span>
                <div className="flex items-center gap-1">
                  <ActionButton
                    action={toggleTestimonialPublished}
                    id={t.id}
                    title={t.published ? "Hide" : "Show"}
                    toastMessage={t.published ? "Hidden" : "Published"}
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                  >
                    {t.published ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </ActionButton>
                  <Link
                    href={`/admin/testimonials/${t.id}/edit`}
                    title="Edit"
                    aria-label="Edit"
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <ActionButton
                    action={deleteTestimonial}
                    id={t.id}
                    title="Delete"
                    confirm="Delete this testimonial? This cannot be undone."
                    toastMessage="Testimonial deleted"
                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-sage-deep/40 bg-paper/60 p-12 text-center">
          <h2 className="font-display text-xl text-forest">No testimonials yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Add a few anonymous words of encouragement from past clients.
          </p>
          <Link
            href="/admin/testimonials/new"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper hover:bg-forest/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New testimonial
          </Link>
        </div>
      )}
    </>
  );
}
