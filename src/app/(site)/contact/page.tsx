import type { Metadata } from "next";
import { Mail, Clock, HeartHandshake, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { CalEmbed } from "@/components/ui/CalEmbed";
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

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact & booking"
        title="Let's take the first step together"
        intro="Whether you have a question or you're ready to begin, we'd love to hear from you. Share a little about what's bringing you here, and we'll take it from there."
      />

      <Section spacing="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <Reveal className="order-2 lg:order-1">
              <div className="rounded-3xl border border-sage-deep/25 bg-paper p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl text-pine">Send a message</h2>
                <p className="mb-6 mt-1.5 text-sm leading-relaxed text-muted">
                  Fields marked as optional can be left blank.
                </p>
                <ContactForm />
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <aside className="lg:pt-4">
                <h2 className="font-display text-2xl text-pine">
                  What to expect
                </h2>
                <p className="mt-2 leading-relaxed text-muted">
                  Taking the first step can feel big. Here&rsquo;s what happens after
                  you reach out.
                </p>
                <ul className="mt-7 space-y-6">
                  {reassurances.map((item) => {
                    const Icon = item.icon;
                    const body = item.href ? (
                      <a
                        href={item.href}
                        className="text-muted underline underline-offset-2 hover:text-pine"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-muted">{item.text}</span>
                    );
                    return (
                      <li key={item.title} className="flex gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-pine">
                          <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-display text-lg text-pine">
                            {item.title}
                          </h3>
                          <p className="mt-1 leading-relaxed">{body}</p>
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

      <Section id="book" surface="sage" spacing="md">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Book online"
            title="Ready to book a session?"
            intro="Choose a time that works for you and we'll take it from there."
            className="mx-auto"
          />
          <Reveal className="mx-auto mt-10 max-w-4xl">
            {site.calcomConfigured ? (
              <div className="overflow-hidden rounded-3xl border border-sage-deep/25 bg-paper shadow-soft">
                <CalEmbed calLink={site.calcomLink} />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-sage-deep/40 bg-paper/70 p-10 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-sage text-pine">
                  <CalendarDays className="size-7" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl text-pine">
                  Online booking is on its way
                </h3>
                <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted">
                  Our live calendar will appear here once it&rsquo;s connected. In the
                  meantime, send a message above or email us and we&rsquo;ll find a time
                  together.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper shadow-soft transition hover:bg-pine/90"
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
