import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/actions/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s — ${site.name} Admin` },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Belt-and-suspenders with the middleware.
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-sage/15 lg:flex">
      <AdminSidebar user={session.user} logoutAction={logoutAction} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
