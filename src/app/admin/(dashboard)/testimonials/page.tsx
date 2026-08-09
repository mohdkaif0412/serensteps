import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Info, Quote } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { Flash } from "@/components/admin/Flash";
import { EmptyState } from "@/components/admin/EmptyState";
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift sm:w-auto"
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Quote
                className="size-5 shrink-0 text-mint-deep/50"
                aria-hidden="true"
              />
              <blockquote className="mt-3 flex-1 font-display text-[0.95rem] italic leading-relaxed text-forest/90">
                {`“${t.quote}”`}
              </blockquote>
              <div className="mt-4 flex items-start justify-between gap-2 border-t border-sage-deep/15 pt-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-forest">{t.name}</p>
                  {t.role && (
                    <p className="truncate text-xs text-muted">{t.role}</p>
                  )}
                </div>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage/70 text-xs font-medium text-forest">
                  {t.order}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
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
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add a few anonymous words of encouragement from past clients."
          action={{
            href: "/admin/testimonials/new",
            label: "New testimonial",
            icon: Plus,
          }}
        />
      )}
    </>
  );
}
