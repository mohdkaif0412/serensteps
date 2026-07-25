import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    `How ${site.name} collects, uses, and protects your personal information.`,
};

const html = `
<p><em>Last updated 18 July 2026.</em></p>
<p>Your privacy matters to us. This notice explains, in plain language, what information we collect through this website, how we use it, and the choices you have. It is separate from the confidentiality of your therapy sessions, which we discuss with you directly.</p>

<h2>What we collect</h2>
<p>When you contact us or book a session, we collect the details you choose to share — such as your name, email address, phone number, and the message you send us. We collect this only so we can respond to you and arrange your care.</p>

<h2>How we use your information</h2>
<ul>
<li>To reply to your enquiry and arrange appointments.</li>
<li>To provide and manage your care with us.</li>
<li>To meet our professional and legal obligations.</li>
</ul>
<p>We do not sell your information, and we never use it for advertising.</p>

<h2>How messages reach us</h2>
<p>Contact-form submissions are delivered to us by email through a trusted delivery provider. Booking is handled by our scheduling provider. These providers process your details only to deliver the service to us.</p>

<h2>How long we keep it</h2>
<p>We keep your information only as long as necessary for your care and to meet our professional and legal obligations, after which it is securely deleted.</p>

<h2>Your rights</h2>
<p>You can ask to see the information we hold about you, to correct it, or to have it deleted, subject to any records we are required to keep. To make a request, just get in touch.</p>

<h2>Contact us</h2>
<p>If you have any questions about this notice or your information, please email us at <a href="mailto:${site.email}">${site.email}</a>.</p>
`;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy notice"
        intro="How we look after the information you share with us."
      />
      <Section spacing="md">
        <Container size="prose">
          <div className="prose-serene" dangerouslySetInnerHTML={{ __html: html }} />
          <p className="mt-12 rounded-2xl border border-sage-deep/25 bg-sage/40 p-5 text-sm leading-relaxed text-muted">
            <strong className="text-forest">Note for the practice:</strong> this is a
            plain-language starting template. Please have it reviewed by a qualified
            professional to ensure it reflects your jurisdiction and how you actually
            handle data before you rely on it.
          </p>
        </Container>
      </Section>
    </>
  );
}
