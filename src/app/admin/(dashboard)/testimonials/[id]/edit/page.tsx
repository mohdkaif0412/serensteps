import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <>
      <Link
        href="/admin/testimonials"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to testimonials
      </Link>
      <AdminPageHeader title="Edit testimonial" />
      <TestimonialForm
        testimonial={{
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          order: testimonial.order,
          published: testimonial.published,
        }}
      />
    </>
  );
}
