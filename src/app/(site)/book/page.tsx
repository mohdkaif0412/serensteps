import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { getActiveSessionTypes } from "@/lib/queries";
import { bookingConfig } from "@/lib/booking/config";
import { bookingPage } from "@/lib/content/booking";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Book a session",
  description: `Book counselling, an assessment or a reflective session with ${site.name}. Pick a time that suits you, tell us what brings you here, and we'll confirm by email.`,
  path: "/book",
});

// Session types are database-backed, so a database-less build self-heals.
export const revalidate = 300;

export default async function BookPage() {
  const sessionTypes = await getActiveSessionTypes();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Book a session", path: "/book" }])} />
      <PageHeader
        eyebrow={bookingPage.eyebrow}
        title={
          <>
            Find a time that <em>suits you</em>
          </>
        }
        intro={bookingPage.intro}
      />

      <Section spacing="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <BookingFlow
                sessionTypes={sessionTypes}
                timeZone={bookingConfig.timeZone}
              />
            </Reveal>

            <Reveal className="lg:col-span-5">
              <aside className="lg:sticky lg:top-28 lg:pl-4">
                <h2 className="font-display text-2xl text-forest sm:text-[1.7rem]">
                  What happens <em>next</em>
                </h2>
                <ol className="mt-6 space-y-6">
                  {bookingPage.whatHappensNext.map((item, index) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage font-display text-forest">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-forest">
                          {item.title}
                        </h3>
                        <p className="mt-1 leading-[1.7] text-muted">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <ul className="mt-8 space-y-2 rounded-2xl border border-sage-deep/20 bg-cream p-5">
                  {bookingPage.reassurance.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-forest/85"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-mint-deep"
                      />
                      {line}
                    </li>
                  ))}
                </ul>

                {/* Some people would rather not fill in anything at all. */}
                <h2 className="mt-10 font-display text-xl text-forest">
                  Would rather just talk?
                </h2>
                <div className="mt-4 space-y-2">
                  <a
                    href={site.phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border-2 border-mint-deep/25 bg-mint-soft p-3.5 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-mint">
                      <WhatsAppIcon className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-forest">
                      WhatsApp us on {site.phone.display}
                    </span>
                  </a>
                  <a
                    href={site.phone.tel}
                    className="flex items-center gap-3 rounded-2xl border border-sage-deep/25 bg-cream p-3.5 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-mint-deep/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage text-forest">
                      <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-forest">
                      Call {site.phone.display}
                    </span>
                  </a>
                  <Link
                    href="/contact#enquiry"
                    className="flex items-center gap-3 rounded-2xl border border-sage-deep/25 bg-cream p-3.5 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-mint-deep/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage text-forest">
                      <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-forest">
                      Send a message instead
                    </span>
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
