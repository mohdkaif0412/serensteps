import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SessionTypeForm } from "@/components/admin/SessionTypeForm";

export const metadata = { title: "New session type" };

export default function NewSessionTypePage() {
  return (
    <>
      <AdminPageHeader
        title="New session type"
        description="Something new people can book through the site."
      />
      <SessionTypeForm />
    </>
  );
}
