import { contactSchema, fieldErrors, FILE_RULES } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { inbox, sendMail } from "@/lib/mail";
import { contactConfirmation, contactNotification } from "@/lib/mail/templates";
import { readUploads, storeUploads, UploadError, type UploadedFile } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Accepts multipart/form-data (with optional attachments) or JSON. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  const limit = rateLimit(`contact:${clientIp(req)}`, 5);
  if (!limit.ok) return Response.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const len = Number(req.headers.get("content-length") || 0);
  if (len > FILE_RULES.maxTotalBytes + 1024 * 1024) return Response.json({ ok: false, error: "Your files are too large. Each file can be up to 5 MB." }, { status: 413 });

  let raw: Record<string, unknown>;
  let form: FormData | null = null;
  try {
    if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
      form = await req.formData();
      raw = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
      raw.consent = raw.consent === "true" || raw.consent === "on";
    } else {
      raw = await req.json();
    }
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;
  // Bots: honeypot filled or submitted faster than a human could type → pretend success.
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 2500)) return Response.json({ ok: true });

  let files: UploadedFile[] = [];
  try {
    if (form) files = await readUploads(form, "attachments", "Attachment");
  } catch (e) {
    if (e instanceof UploadError) return Response.json({ ok: false, error: e.message, fields: { attachments: e.message } }, { status: 422 });
    throw e;
  }

  try {
    const stored = await storeUploads("contact", files, { name: d.name, email: d.email, company: d.company });
    const flat = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "")]));
    const n = contactNotification(flat, stored);
    await sendMail({
      to: [inbox("contact")],
      subject: n.subject,
      html: n.html,
      text: n.text,
      replyTo: { email: d.email, name: d.name },
      attachments: files.map((f) => ({ filename: f.filename, contentType: f.contentType, content: f.content })),
    });
    if (process.env.MAIL_SEND_CONFIRMATION !== "false") {
      const c = contactConfirmation(d.name);
      await sendMail({ to: [d.email], subject: c.subject, html: c.html, text: c.text }).catch((e) => console.error("[contact] confirmation failed", e));
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[contact] send failed", e);
    return Response.json({ ok: false, error: "We could not send your message right now. Please email info@qs-global-solutions.com." }, { status: 502 });
  }
}
