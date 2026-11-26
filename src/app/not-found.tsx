import type { Metadata } from "next";
import Link from "next/link";
import { NotFound } from "@/components/sections/NotFound";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { notFoundPage } from "@/lib/content/not-found";

export const metadata: Metadata = {
  title: notFoundPage.metaTitle,
  robots: { index: false, follow: true },
};

/**
 * Root fallback, for a `notFound()` thrown outside the (site) group — e.g. a
 * missing record in the admin. Public URLs are caught by `(site)/[...missing]`
 * and get the full site chrome instead; this one carries just the logo.
 */
export default function RootNotFound() {
  return (
    <>
      <header>
        <Container className="flex items-center py-5">
          <Link href="/" aria-label="Home">
            <Logo className="h-10" priority />
          </Link>
        </Container>
      </header>
      <main id="main" className="flex-1">
        <NotFound />
      </main>
    </>
  );
}
