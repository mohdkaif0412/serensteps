import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/ui/Logo";
import { RiseIn } from "@/components/ui/RevealText";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

// Interactive auth page — render dynamically rather than prerendering at build.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel — orients the sign-in as part of the site, not a bare form. */}
      <div className="on-forest relative hidden flex-col justify-between overflow-hidden bg-forest px-12 py-12 text-paper lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-mint/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-mint-soft/10 blur-3xl"
        />

        <RiseIn>
          <LogoMark tone="dark" className="h-10" />
        </RiseIn>

        <RiseIn as="div" delay={1} className="relative max-w-sm">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-mint-pale">
            Content admin
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-paper">
            Welcome back to {site.name}
          </h1>
          <p className="mt-4 text-mint-pale">
            Sign in to manage posts, pages, and everything readers see on the
            site.
          </p>
        </RiseIn>

        <p className="relative text-xs text-mint-pale/70">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-5 py-16">
        <div className="w-full max-w-md">
          <RiseIn className="mb-8 flex flex-col items-center text-center lg:hidden">
            <LogoMark tone="light" className="h-10" />
            <p className="mt-3 text-sm text-muted">
              Content admin — please sign in
            </p>
          </RiseIn>

          <RiseIn delay={1} className="hidden lg:mb-8 lg:block">
            <h2 className="font-display text-2xl text-forest">Sign in</h2>
            <p className="mt-1 text-sm text-muted">
              Enter your credentials to continue.
            </p>
          </RiseIn>

          <RiseIn
            delay={2}
            className="rounded-3xl border border-sage-deep/25 bg-cream p-8 shadow-soft"
          >
            <LoginForm />
          </RiseIn>

          <RiseIn delay={3} as="p" className="mt-6 text-center text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-muted underline underline-offset-2 hover:text-forest"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to the website
            </Link>
          </RiseIn>
        </div>
      </div>
    </div>
  );
}
