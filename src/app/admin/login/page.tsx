import type { Metadata } from "next";
import Link from "next/link";
import { Footprints } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

// Interactive auth page — render dynamically rather than prerendering at build.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-full bg-forest text-paper">
            <Footprints className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-3xl text-forest">{site.name}</h1>
          <p className="mt-1 text-sm text-muted">Content admin — please sign in</p>
        </div>

        <div className="rounded-3xl border border-sage-deep/25 bg-sage/25 p-8 shadow-soft">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="underline underline-offset-2 hover:text-forest">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
