"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { emailLayout, emailQuote, emailRow, escapeHtml, sendEmail } from "@/lib/email";
import { site } from "@/lib/site";

export type ContactResult = { ok: boolean; error?: string };

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the details and try again." };
  }

  const { website, ...data } = parsed.data;
  // Honeypot: bots fill this. Pretend success and drop it silently.
  if (website && website.length > 0) return { ok: true };

  try {
    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        concern: data.concern,
        message: data.message,
      },
    });
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong sending your message. Please try again, or email us directly.",
    };
  }

  await sendNotificationEmail(data);

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  return { ok: true };
}

async function sendNotificationEmail(data: Omit<ContactInput, "website">) {
  await sendEmail({
    to: process.env.CONTACT_NOTIFY_TO || site.email,
    replyTo: data.email,
    subject: `New enquiry from ${data.name} — ${data.concern}`,
    html: emailLayout({
      heading: "New contact form submission",
      body: `<table style="width:100%;border-collapse:collapse;">
          ${emailRow("Name", escapeHtml(data.name))}
          ${emailRow("Email", escapeHtml(data.email))}
          ${data.phone ? emailRow("Phone", escapeHtml(data.phone)) : ""}
          ${emailRow("Concern", escapeHtml(data.concern))}
        </table>
        ${emailQuote(data.message)}`,
    }),
  });
}
