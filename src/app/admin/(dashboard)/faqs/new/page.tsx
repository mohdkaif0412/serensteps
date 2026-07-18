import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FaqForm } from "@/components/admin/FaqForm";

export const metadata = { title: "New FAQ" };

async function getCategories() {
  const rows = await prisma.faq.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category).filter((c): c is string => Boolean(c));
}

export default async function NewFaqPage() {
  const categories = await getCategories();
  return (
    <>
      <Link
        href="/admin/faqs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-pine"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to FAQs
      </Link>
      <AdminPageHeader title="New FAQ" />
      <FaqForm categories={categories} />
    </>
  );
}
