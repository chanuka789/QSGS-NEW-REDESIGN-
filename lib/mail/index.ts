import "server-only";
import { sendWithGraph } from "./graph";
import { sendWithSmtp } from "./smtp";
import type { MailMessage } from "./types";

export type { MailMessage, MailAttachment } from "./types";

type Provider = "graph" | "smtp" | "console";

export function mailProvider(): Provider | null {
  const explicit = process.env.MAIL_PROVIDER?.toLowerCase();
  if (explicit === "graph" || explicit === "smtp" || explicit === "console") return explicit;
  if (process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_SECRET && process.env.MAIL_FROM) return "graph";
  if (process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_AUTH === "oauth2")) return "smtp";
  if (process.env.NODE_ENV !== "production") return "console";
  return null;
}

export async function sendMail(m: MailMessage) {
  const provider = mailProvider();
  if (!provider) throw new Error("Email is not configured. Set MAIL_PROVIDER and the Microsoft 365 variables (see .env.example).");
  if (provider === "graph") return sendWithGraph(m);
  if (provider === "smtp") return sendWithSmtp(m);
  console.info(`[mail:console] To: ${m.to.join(", ")} | Subject: ${m.subject} | Attachments: ${m.attachments?.length ?? 0}\n${m.text}`);
}

export const inbox = (kind: "contact" | "careers") =>
  (kind === "careers" ? process.env.CAREERS_MAIL_TO : process.env.CONTACT_MAIL_TO) || process.env.MAIL_TO || "info@qs-global-solutions.com";
