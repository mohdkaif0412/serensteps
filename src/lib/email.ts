/**
 * Outbound email, in one place.
 *
 * SMTP (via Nodemailer) is optional everywhere: with `SMTP_HOST` unset,
 * `sendEmail` quietly no-ops and returns `false`. Nothing user-facing may ever
 * fail because of an email — a contact message and a booking request are both
 * saved first, then the email is attempted.
 *
 * The transporter is created once and reused across calls (Nodemailer pools
 * connections internally), rather than reconnecting to the SMTP server per send.
 *
 * Note the hex codes below. Email clients have no access to the Tailwind theme,
 * so the palette has to be inlined here — these are the same values as the
 * `forest` / `mint` / `cream` tokens in `src/app/globals.css`, and this file is
 * the only place outside that stylesheet where they should appear.
 */

import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

const palette = {
  forest: "#174238",
  forestDeep: "#0F2C25",
  mint: "#4DBB94",
  mintDeep: "#2E8F6B",
  cream: "#F6F3EC",
  paper: "#FDFCF9",
  sage: "#DCE7DF",
  muted: "#5A6B63",
};

export type EmailAttachment = {
  filename: string;
  /** Raw file contents; encoded for Resend on the way out. */
  content: string;
};

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

/** Escape untrusted text before it goes anywhere near an HTML template. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A plain-text alternative for the HTML body. Spam filters weight HTML-only
 * mail (no `text/plain` part) heavily, so every send includes one.
 */
function htmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<\/(p|div|tr|h1|h2|h3)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

let transporter: Transporter | undefined;

/** Built once per server process and reused — Nodemailer pools the SMTP connection. */
function getTransporter(): Transporter | undefined {
  const host = process.env.SMTP_HOST;
  if (!host) return undefined;
  if (transporter) return transporter;

  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

/**
 * Send one email. Returns whether it actually went out, and never throws —
 * callers treat email as best-effort.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: SendEmailInput): Promise<boolean> {
  const smtp = getTransporter();
  if (!smtp || !to || (Array.isArray(to) && to.length === 0)) return false;

  try {
    const from = process.env.SMTP_FROM ?? `${site.name} <${site.email}>`;
    await smtp.sendMail({
      from,
      to,
      subject,
      html,
      text: htmlToText(html),
      ...(replyTo ? { replyTo } : {}),
      ...(attachments?.length
        ? {
            attachments: attachments.map((file) => ({
              filename: file.filename,
              content: Buffer.from(file.content).toString("base64"),
              encoding: "base64",
            })),
          }
        : {}),
    });
    return true;
  } catch (error) {
    console.error(`[email] "${subject}" failed to send:`, error);
    return false;
  }
}

/** A labelled row, for the detail blocks in every template. */
export function emailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;color:${palette.muted};font-size:14px;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:${palette.forest};font-size:15px;font-weight:600;">${value}</td>
  </tr>`;
}

/** A quoted block for anything the sender wrote themselves. */
export function emailQuote(text: string) {
  return `<p style="white-space:pre-line;background:${palette.cream};border-left:3px solid ${palette.mint};padding:14px 18px;border-radius:10px;margin:8px 0 0;color:${palette.forest};font-size:15px;line-height:1.7;">${escapeHtml(
    text,
  )}</p>`;
}

export function emailButton(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${palette.forest};color:${palette.paper};text-decoration:none;padding:13px 26px;border-radius:999px;font-size:15px;font-weight:600;">${escapeHtml(
    label,
  )}</a>`;
}

/**
 * The shared shell: a cream card on paper, the practice's name at the top and
 * its contact lines at the bottom. `body` is trusted HTML built by the caller
 * from already-escaped values.
 */
export function emailLayout({
  heading,
  intro,
  body,
  footNote,
}: {
  heading: string;
  intro?: string;
  body: string;
  footNote?: string;
}) {
  return `<div style="margin:0;padding:24px;background:${palette.sage};font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:${palette.paper};border-radius:24px;overflow:hidden;">
    <div style="background:${palette.forest};padding:24px 32px;">
      <p style="margin:0;color:${palette.mint};font-size:13px;letter-spacing:0.18em;text-transform:uppercase;">${escapeHtml(site.name)}</p>
      <h1 style="margin:8px 0 0;color:${palette.paper};font-size:24px;font-weight:600;line-height:1.3;">${escapeHtml(heading)}</h1>
    </div>
    <div style="padding:28px 32px 32px;">
      ${intro ? `<p style="margin:0 0 20px;color:${palette.muted};font-size:15px;line-height:1.75;">${escapeHtml(intro)}</p>` : ""}
      ${body}
      ${
        footNote
          ? `<p style="margin:24px 0 0;color:${palette.muted};font-size:13px;line-height:1.7;">${escapeHtml(footNote)}</p>`
          : ""
      }
    </div>
    <div style="padding:18px 32px 26px;border-top:1px solid ${palette.sage};">
      <p style="margin:0;color:${palette.muted};font-size:13px;line-height:1.8;">
        ${escapeHtml(site.name)} · <a href="mailto:${escapeHtml(site.email)}" style="color:${palette.mintDeep};text-decoration:none;">${escapeHtml(site.email)}</a> · ${escapeHtml(site.phone.display)}<br />
        <a href="${escapeHtml(site.url)}" style="color:${palette.mintDeep};text-decoration:none;">${escapeHtml(site.url.replace(/^https?:\/\//, ""))}</a>
      </p>
    </div>
  </div>
</div>`;
}

export { palette as emailPalette };
