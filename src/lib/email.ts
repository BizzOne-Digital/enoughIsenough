import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Best-effort email notifications for form submissions. This is entirely
 * optional — the submission is always saved to MongoDB first and the
 * public-facing API call never fails because of email trouble. Configure
 * SMTP_HOST/SMTP_USER/SMTP_PASS/ADMIN_EMAIL to turn it on.
 */

function getRecipients(): string[] {
  return (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && getRecipients().length > 0);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";
}

interface SendOptions {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}

async function send({ to, subject, text, replyTo }: SendOptions): Promise<void> {
  const t = getTransporter();
  if (!t) return;
  try {
    await t.sendMail({
      from: getFromAddress(),
      to,
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
  } catch (err) {
    // Never let an email failure break the request that triggered it —
    // the submission itself is already safely stored in MongoDB.
    console.error("[email] Failed to send:", err);
  }
}

/** Notifies the admin inbox(es) configured in ADMIN_EMAIL. No-op if email isn't configured. */
export async function notifyAdmin(subject: string, text: string, replyTo?: string): Promise<void> {
  const to = getRecipients();
  if (to.length === 0) return;
  await send({ to, subject, text, replyTo });
}

/** Sends a short confirmation to the person who submitted a form. No-op if email isn't configured. */
export async function sendConfirmation(to: string, subject: string, text: string): Promise<void> {
  if (!to) return;
  await send({ to, subject, text });
}
