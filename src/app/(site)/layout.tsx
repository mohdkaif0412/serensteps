import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { BootLoader, BootLoaderFlag } from "@/components/ui/BootLoader";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { Cursor } from "@/components/ui/Cursor";
import { siteGraphJsonLd } from "@/lib/structured-data";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    </>
  );
}
