import type { Metadata } from "next";
import { Mail, Clock, HeartHandshake, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { CalEmbed } from "@/components/ui/CalEmbed";
import { CalendlyEmbed } from "@/components/ui/CalendlyEmbed";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Reach out to Serene Steps or book your first session. Take a step forward — we're here whenever you're ready.",
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
  {
    icon: Mail,
    title: "Prefer email?",
    text: site.email,
    href: `mailto:${site.email}`,
  },
];

export default async function ContactPage() {
  // const testimonials = await getPublishedTestimonials();
  // // One quiet reassurance beside the form, easing the moment of reaching out.
  // const whisper = testimonials.at(-1);

  return (
    <>
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
                  className="absolute inset-x-9 top-0 h-[3px] rounded-b-full bg-honey/70"
                />
                <h2 className="font-display text-2xl text-pine sm:text-[1.7rem]">
                  Send a message
                </h2>
                <p className="mb-6 mt-2 text-sm leading-relaxed text-muted">
                  Fields marked as optional can be left blank.
                </p>
                <ContactForm />
              </div>
            </Reveal>

            {/* What to expect — a small designed sequence, not a plain list */}
            <Reveal className="order-1 lg:order-2 lg:col-span-5">
              <aside className="lg:sticky lg:top-28 lg:pl-4">
                <h2 className="font-display text-2xl text-pine sm:text-[1.7rem]">
                  What to <em>expect</em>
                </h2>
                <p className="mt-3 max-w-[48ch] leading-[1.75] text-muted">
                  Taking the first step can feel big. Here&rsquo;s what happens after
                  you reach out.
                </p>
                <ul className="relative mt-7 space-y-6 border-l border-dashed border-sage-deep/40 pl-8">
                  {reassurances.map((item, i) => {
                    const Icon = item.icon;
                    const body = item.href ? (
                      <a
                        href={item.href}
                        className="link-underline text-muted hover:text-pine"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-muted">{item.text}</span>
                    );
                    return (
                      <li key={item.title} className="relative">
                        <span
                          className="absolute -left-8 top-1 grid size-7 -translate-x-1/2 place-items-center rounded-full border border-honey bg-paper font-display text-[0.8rem] text-honey-deep shadow-soft"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <div className="flex items-start gap-4">
                          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-pine">
                            <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                          </span>
                          <div>
                            <h3 className="font-display text-lg text-pine">
                              {item.title}
                            </h3>
                            <p className="mt-1 leading-[1.7]">{body}</p>
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
                <div className="grid size-14 place-items-center rounded-full bg-sage text-pine">
                  <CalendarDays className="size-7" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl text-pine">
                  Online booking is on its way
                </h3>
                <p className="mt-2 max-w-md leading-[1.75] text-muted">
                  Our live calendar will appear here once it&rsquo;s connected. In the
                  meantime, send a message above or email us and we&rsquo;ll find a time
                  together.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Email to book
                </a>
              </div>
            )}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
