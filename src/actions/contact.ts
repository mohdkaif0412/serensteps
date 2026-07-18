"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { contactSchema, type ContactInput } from "@/lib/validation";
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
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO || site.email;
  // Email is optional — if Resend isn't configured, the submission is still saved.
  if (!apiKey || !to) return;

  try {
    const resend = new Resend(apiKey);
    const from = process.env.CONTACT_FROM ?? "Serene Steps <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New enquiry from ${data.name} — ${data.concern}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #24352f;">
          <h2 style="font-weight: 600;">New contact form submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
          <p><strong>Concern:</strong> ${escapeHtml(data.concern)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line; background:#f6f3ec; padding:12px 16px; border-radius:8px;">${escapeHtml(
            data.message,
          )}</p>
        </div>
      `,
    });
  } catch (error) {
    // Never fail the user's submission because of an email hiccup.
    console.error("Resend notification failed:", error);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
