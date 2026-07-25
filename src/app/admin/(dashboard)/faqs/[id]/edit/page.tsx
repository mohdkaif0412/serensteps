import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FaqForm } from "@/components/admin/FaqForm";

export const metadata = { title: "Edit FAQ" };

async function getCategories() {
  const rows = await prisma.faq.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category).filter((c): c is string => Boolean(c));
}

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faq, categories] = await Promise.all([
    prisma.faq.findUnique({ where: { id } }),
    getCategories(),
  ]);
  if (!faq) notFound();

  return (
    <>
      <Link
        href="/admin/faqs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to FAQs
      </Link>
      <AdminPageHeader title="Edit FAQ" />
      <FaqForm
        categories={categories}
        faq={{
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          order: faq.order,
          published: faq.published,
        }}
      />
    </>
  );
}
