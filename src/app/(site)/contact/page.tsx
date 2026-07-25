import type { Metadata } from "next";
import { Mail, Phone, Clock, HeartHandshake, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { CalEmbed } from "@/components/ui/CalEmbed";
import { CalendlyEmbed } from "@/components/ui/CalendlyEmbed";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Reach out to Serene Step by email, phone, or WhatsApp — or book your first session. Take a step forward; we're here whenever you're ready.",
  alternates: { canonical: "/contact" },
};

const reassurances = [
  {
    icon: HeartHandshake,
    title: "No pressure, ever",
    text: "Reaching out isn't a commitment. It's simply a first conversation to see if we're the right fit.",
  },
  {
    icon: Clock,
    title: "A warm, prompt reply",
    text: "We usually respond within a couple of working days, with care and without judgment.",
  },
];

export default async function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHeader
        eyebrow="Contact & booking"
        title={
          <>
            Let&rsquo;s take the <em>first step</em> together
          </>
        }
        intro="Whether you have a question or you're ready to begin, we'd love to hear from you. Share a little about what's bringing you here, and we'll take it from there."
      />

      <Section id="enquiry" spacing="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            {/* The form — an elevated sheet of paper */}
            <Reveal className="order-2 lg:order-1 lg:col-span-7">
              <div className="relative rounded-[2rem] border border-sage-deep/20 bg-cream p-6 shadow-lift sm:p-9">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-9 top-0 h-[3px] rounded-b-full bg-mint-deep/70"
                />
                {/* Borrowing the brand's own "Type your thoughts here" line —
                    a gentler invitation than "Send a message". */}
                <h2 className="font-display text-2xl text-forest sm:text-[1.7rem]">
                  Type your thoughts <em>here</em>
                </h2>
                <p className="mb-6 mt-2 text-sm leading-relaxed text-muted">
                  As much or as little as you like. Fields marked optional can be
                  left blank.
                </p>
                <ContactForm />
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2 lg:col-span-5">
              <aside className="lg:sticky lg:top-28 lg:pl-4">
                {/* Direct lines first — some people would rather not use a form,
                    and WhatsApp is the lowest-friction option of all. */}
                <h2 className="font-display text-2xl text-forest sm:text-[1.7rem]">
                  Or reach us <em>directly</em>
                </h2>
                <div className="mt-5 space-y-3">
                  <a
                    href={site.phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border-2 border-mint-deep/25 bg-mint-soft p-4 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-mint">
                      <WhatsAppIcon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-forest">
                        Message us on WhatsApp
                      </span>
                      <span className="block text-sm text-muted">
                        {site.phone.display} — usually the fastest reply
                      </span>
                    </span>
                  </a>

                  <ContactRow
                    icon={<Mail className="size-5" strokeWidth={1.75} />}
                    href={`mailto:${site.email}`}
                    label="Email us"
                    value={site.email}
                  />
                  <ContactRow
                    icon={<Phone className="size-5" strokeWidth={1.75} />}
                    href={site.phone.tel}
                    label="Call us"
                    value={site.phone.display}
                  />
                  {/* Shown only once a real handle is configured — no dead links.
                      See NEXT_PUBLIC_INSTAGRAM_URL. */}
                  {site.socials.instagram && (
                    <ContactRow
                      icon={<InstagramIcon className="size-5" />}
                      href={site.socials.instagram}
                      label="Follow along"
                      value="Instagram"
                      external
                    />
                  )}
                </div>

                {/* What to expect — a small designed sequence, not a plain list */}
                <h2 className="mt-10 font-display text-2xl text-forest sm:text-[1.7rem]">
                  What to <em>expect</em>
                </h2>
                <ul className="relative mt-6 space-y-6 border-l border-dashed border-sage-deep/40 pl-8">
                  {reassurances.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.title} className="relative">
                        <span
                          className="absolute -left-8 top-1 grid size-7 -translate-x-1/2 place-items-center rounded-full border border-mint-deep bg-paper font-display text-[0.8rem] text-mint-deep shadow-soft"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <div className="flex items-start gap-4">
                          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-forest">
                            <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                          </span>
                          <div>
                            <h3 className="font-display text-lg text-forest">
                              {item.title}
                            </h3>
                            <p className="mt-1 leading-[1.7] text-muted">{item.text}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section id="book" surface="mist" spacing="md">
        <Container>
          <SectionHeading
            eyebrow="Book online"
            title={
              <>
                Ready to <em>book a session?</em>
              </>
            }
            intro="Choose a time that works for you and we'll take it from there."
          />
          <Reveal className="mt-8 max-w-4xl">
            {site.booking.configured ? (
              <div className="overflow-hidden rounded-[2rem] border border-sage-deep/20 bg-cream shadow-lift">
                {site.booking.provider === "calcom" ? (
                  <CalEmbed calLink={site.booking.calcomLink} />
                ) : (
                  <CalendlyEmbed url={site.booking.calendlyUrl} />
                )}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-sage-deep/40 bg-cream/80 p-10">
                <div className="grid size-14 place-items-center rounded-full bg-sage text-forest">
                  <CalendarDays className="size-7" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl text-forest">
                  Online booking is on its way
                </h3>
                <p className="mt-2 max-w-md leading-[1.75] text-muted">
                  Our live calendar will appear here once it&rsquo;s connected. In the
                  meantime, send a message above, WhatsApp us, or email and
                  we&rsquo;ll find a time together.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={site.phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-medium text-forest shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp to book
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Email to book
                  </a>
                </div>
              </div>
            )}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

function ContactRow({
  icon,
  href,
  label,
  value,
  external = false,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 rounded-2xl border border-sage-deep/25 bg-cream p-4 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-mint-deep/40 hover:shadow-soft"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-forest">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
        <span className="block truncate font-medium text-forest">{value}</span>
      </span>
    </a>
  );
}
