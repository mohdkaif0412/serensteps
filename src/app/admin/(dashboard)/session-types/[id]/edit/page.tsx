import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SessionTypeForm } from "@/components/admin/SessionTypeForm";

export const metadata = { title: "Edit session type" };

export default async function EditSessionTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const type = await prisma.sessionType.findUnique({ where: { id } });
  if (!type) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit session type"
        description="Changes apply to new bookings straight away. Sessions already booked keep the length they were booked at."
      />
      <SessionTypeForm
        type={{
          id: type.id,
          name: type.name,
          slug: type.slug,
          blurb: type.blurb,
          durationMin: type.durationMin,
          bufferMin: type.bufferMin,
          modes: type.modes,
          price: type.price,
          order: type.order,
          active: type.active,
        }}
      />
    </>
  );
}
