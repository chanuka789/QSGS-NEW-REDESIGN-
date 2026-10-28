import "server-only";
import { inbox, sendMail } from "./mail";
import { adminNotification, visitorConfirmation } from "./mail/templates";
import { newSubmissionId, saveSubmission, type Submission, type SubmissionKind } from "./submissions";
import { storeUploads, type UploadedFile } from "./uploads";

/** Largest total of files attached to the notification email (the rest open from the dashboard). */
const ATTACH_LIMIT = 18 * 1024 * 1024;

/** Public URL of the site that received the request (email images and dashboard links). */
export function publicBase(req: Request) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

type Input = Omit<Submission, "id" | "createdAt" | "files" | "read" | "starred" | "archived" | "note" | "mail">;

/**
 * Saves a submission (record + files) for the dashboard, emails the QSGS inbox with the
 * files attached, and sends the visitor a confirmation. Succeeds if the submission was
 * saved or the notification was delivered, so nothing is lost when one side is down.
 */
export async function processSubmission(kind: SubmissionKind, input: Input, files: UploadedFile[], base: string) {
  const id = newSubmissionId(kind);
  const s: Submission = {
    ...input,
    id,
    kind,
    createdAt: new Date().toISOString(),
    files: [],
    read: false,
    starred: false,
    archived: false,
    note: "",
    mail: { notified: false, confirmed: false },
  };

  let saved = false;
  try {
    s.files = await storeUploads(kind, id, files, { name: s.name, email: s.email, kind });
    await saveSubmission(s);
    saved = true;
  } catch (e) {
    console.error(`[${kind}] could not save submission`, e);
    s.files = files.map((f) => ({ name: f.filename, label: f.label, key: `unsaved/${f.filename}`, size: f.content.length, contentType: f.contentType }));
  }

  // Attach files (smallest first) up to the size limit.
  const attached = new Set<string>();
  const attachments: { filename: string; contentType: string; content: Buffer }[] = [];
  let total = 0;
  files
    .map((f, i) => ({ f, ref: s.files[i] }))
    .sort((a, b) => a.f.content.length - b.f.content.length)
    .forEach(({ f, ref }) => {
      if (total + f.content.length > ATTACH_LIMIT) return;
      total += f.content.length;
      attached.add(ref.key);
      attachments.push({ filename: kind === "careers" ? `${f.label} - ${f.filename}` : f.filename, contentType: f.contentType, content: f.content });
    });

  try {
    const n = adminNotification(s, { base, attached });
    await sendMail({ to: [inbox(kind === "careers" ? "careers" : "contact")], subject: n.subject, html: n.html, text: n.text, replyTo: { email: s.email, name: s.name }, attachments });
    s.mail.notified = true;
  } catch (e) {
    console.error(`[${kind}] notification failed`, e);
    s.mail.error = e instanceof Error ? e.message.slice(0, 300) : "Notification failed";
  }

  if (s.mail.notified && process.env.MAIL_SEND_CONFIRMATION !== "false") {
    try {
      const c = visitorConfirmation(s, { base });
      await sendMail({ to: [s.email], subject: c.subject, html: c.html, text: c.text, replyTo: { email: process.env.MAIL_FROM || "info@qs-global-solutions.com" } });
      s.mail.confirmed = true;
    } catch (e) {
      console.error(`[${kind}] confirmation failed`, e);
    }
  }

  if (saved) await saveSubmission(s).catch((e) => console.error(`[${kind}] could not update mail status`, e));
  return { ok: saved || s.mail.notified, id };
}
