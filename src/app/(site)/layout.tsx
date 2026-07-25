import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
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
