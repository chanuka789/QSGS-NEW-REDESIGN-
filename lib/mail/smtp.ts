import "server-only";
import nodemailer from "nodemailer";
import { getAzureToken } from "./graph";
import type { MailMessage } from "./types";

/**
 * SMTP sender for Microsoft 365 (smtp.office365.com:587, STARTTLS).
 * SMTP_AUTH=login  → username + password (Microsoft is retiring this by default from late 2026)
 * SMTP_AUTH=oauth2 → OAuth 2.0 token from the Azure app (SMTP.SendAsApp permission)
 */
export async function sendWithSmtp(m: MailMessage) {
  const user = process.env.SMTP_USER || process.env.MAIL_FROM;
  if (!user) throw new Error("SMTP_USER (or MAIL_FROM) is not configured.");
  const authMode = (process.env.SMTP_AUTH || "login").toLowerCase();
  const port = Number(process.env.SMTP_PORT || 587);

  const auth =
    authMode === "oauth2"
      ? { type: "OAuth2" as const, user, accessToken: (await getAzureToken("https://outlook.office365.com/.default")).token }
      : { user, pass: process.env.SMTP_PASS || "" };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.office365.com",
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    requireTLS: port !== 465,
    auth,
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });

  const from = process.env.MAIL_FROM || user;
  await transporter.sendMail({
    from: process.env.MAIL_FROM_NAME ? { name: process.env.MAIL_FROM_NAME, address: from } : from,
    to: m.to,
    subject: m.subject,
    html: m.html,
    text: m.text,
    replyTo: m.replyTo ? (m.replyTo.name ? { name: m.replyTo.name, address: m.replyTo.email } : m.replyTo.email) : undefined,
    attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
  });
}
