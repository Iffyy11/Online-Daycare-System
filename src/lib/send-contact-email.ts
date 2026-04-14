import { Resend } from "resend";
import { SITE_PUBLIC_EMAIL } from "@/lib/site-contact";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the contact form via [Resend](https://resend.com).
 *
 * Env:
 * - `RESEND_API_KEY` (required to send)
 * - `RESEND_FROM` — default `onboarding@resend.dev`
 * - `CONTACT_INBOX_EMAIL` — recipient (else `NEXT_PUBLIC_CONTACT_EMAIL`, else site default)
 */
export async function sendContactViaResend(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  /** Primary inbox for contact form (set CONTACT_INBOX_EMAIL on Vercel to override). */
  const to = process.env.CONTACT_INBOX_EMAIL?.trim() || SITE_PUBLIC_EMAIL;

  const from = process.env.RESEND_FROM?.trim() || "onboarding@resend.dev";

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message);

  const text = [
    `New message from the Daycare Pro website contact form`,
    ``,
    `Name: ${payload.name}`,
    `Reply-To: ${payload.email}`,
    ``,
    payload.message,
  ].join("\n");

  const html = `
    <p><strong>New contact form message</strong></p>
    <p><strong>Name:</strong> ${safeName}<br/>
    <strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${safeMessage}</p>
  `.trim();

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: `Daycare Pro — message from ${payload.name}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
