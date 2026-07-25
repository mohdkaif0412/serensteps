import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use the ${site.name} website, including how astrology and tarot are and aren't used.`,
};

const html = `
<p><em>Last updated 18 July 2026.</em></p>
<p>Welcome, and thank you for visiting. These terms explain the basis on which you may use this website. By using the site, you agree to them.</p>

<h2>This website is not a crisis service</h2>
<p>The information here is for general guidance and is not a substitute for professional advice, diagnosis, or treatment. If you or someone you love is in crisis or immediate danger, please contact your local emergency services or a 24/7 crisis line right away — do not wait for an appointment.</p>

<h2>Astrology and tarot</h2>
<p>Astrology and tarot are offered only to clients who find them personally meaningful, and always alongside professional counselling — never in place of it.</p>
<ul>
<li>They are <strong>never used as substitutes for mental health treatment</strong>, and never as tools to predict the future.</li>
<li>They are reflective conversations that complement counselling.</li>
<li>We don't tell you what your future will be.</li>
<li>We help you understand yourself, strengthen your resilience, and make decisions with greater awareness.</li>
</ul>
<p>Nothing in a reflective session is a scientific assessment, a diagnosis, or a guarantee about the future.</p>

<h2>Enquiries and bookings</h2>
<p>Sending a message or booking a session is the start of a conversation, not a guarantee of a particular appointment or outcome. We will always confirm details with you directly.</p>

<h2>Cancellations</h2>
<p>Life happens. If you need to cancel or reschedule, we simply ask for as much notice as you can give so the time can be offered to someone else. Any specific cancellation terms will be shared with you when you book.</p>

<h2>Our content</h2>
<p>The words, images, and design on this site are ours (or used with permission) and are provided for your personal, non-commercial use. Please don't reproduce them without asking.</p>

<h2>Changes to these terms</h2>
<p>We may update these terms from time to time. The date at the top shows when they were last revised.</p>

<h2>Contact us</h2>
<p>If anything here is unclear, please email us at <a href="mailto:${site.email}">${site.email}</a> — we're happy to help.</p>
`;

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of use"
        intro="The simple terms that apply when you use this website."
      />
      <Section spacing="md">
        <Container size="prose">
          <div className="prose-serene" dangerouslySetInnerHTML={{ __html: html }} />
          <p className="mt-12 rounded-2xl border border-sage-deep/25 bg-sage/40 p-5 text-sm leading-relaxed text-muted">
            <strong className="text-forest">Note for the practice:</strong> this is a
            plain-language starting template. Please have it reviewed by a qualified
            professional for your jurisdiction before you rely on it.
          </p>
        </Container>
      </Section>
    </>
  );
}
