import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { BootLoader, BootLoaderFlag } from "@/components/ui/BootLoader";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { Cursor } from "@/components/ui/Cursor";
import { BookingChat } from "@/components/booking/BookingChat";
import { siteGraphJsonLd } from "@/lib/structured-data";
import { getActiveSessionTypes } from "@/lib/queries";
import { bookingConfig } from "@/lib/booking/config";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetched here rather than inside the widget so the assistant opens with its
  // choices already in hand — no spinner on the first question.
  const sessionTypes = await getActiveSessionTypes();

  return (
    <>
      {/* Organization + MedicalBusiness + WebSite (+ Person, once named) —
          one graph, one business entity, on every public page. */}
      <JsonLd data={siteGraphJsonLd()} />
      {/* Must be parsed before the curtain below it, so a reader already in
          this session never sees it flash. */}
      <BootLoaderFlag />
      <BootLoader />
      <RouteProgress />
      {/* Fine pointers only, and never under prefers-reduced-motion. */}
      <Cursor />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* The scripted booking assistant. Hides itself on /book and the admin. */}
      <BookingChat sessionTypes={sessionTypes} timeZone={bookingConfig.timeZone} />
    </>
  );
}
