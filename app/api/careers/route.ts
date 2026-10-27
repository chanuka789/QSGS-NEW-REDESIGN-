import { careersSchema, fieldErrors, FILE_RULES } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { inbox, sendMail } from "@/lib/mail";
import { careersConfirmation, careersNotification } from "@/lib/mail/templates";
import { readUploads, storeUploads, UploadError, type UploadedFile } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  const limit = rateLimit(`careers:${clientIp(req)}`, 3);
  if (!limit.ok) return Response.json({ ok: false, error: "Too many applications. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const len = Number(req.headers.get("content-length") || 0);
  if (len > FILE_RULES.maxTotalBytes * 2 + 1024 * 1024) return Response.json({ ok: false, error: "Your files are too large. Each file can be up to 5 MB." }, { status: 413 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const raw = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const parsed = careersSchema.safeParse({ ...raw, consent: raw.consent === "true" || raw.consent === "on" });
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 3000)) return Response.json({ ok: true });

  let files: UploadedFile[];
  try {
    const cv = await readUploads(form, "resume", "CV");
    if (!cv.length) return Response.json({ ok: false, error: "Please upload your resume.", fields: { resume: "Please upload your resume." } }, { status: 422 });
    const cover = await readUploads(form, "coverLetter", "Cover letter");
    files = [...cv, ...cover];
  } catch (e) {
    if (e instanceof UploadError) return Response.json({ ok: false, error: e.message, fields: { resume: e.message } }, { status: 422 });
    throw e;
  }

  const name = `${d.firstName} ${d.lastName}`;
  try {
    const stored = await storeUploads("careers", files, { applicant: name, email: d.email, jobType: d.jobType });
    const flat = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "")]));
    const n = careersNotification(flat, stored);
    await sendMail({
      to: [inbox("careers")],
      subject: n.subject,
      html: n.html,
      text: n.text,
      replyTo: { email: d.email, name },
      attachments: files.map((f) => ({ filename: `${f.label} - ${f.filename}`, contentType: f.contentType, content: f.content })),
    });
    if (process.env.MAIL_SEND_CONFIRMATION !== "false") {
      const c = careersConfirmation(d.firstName);
      await sendMail({ to: [d.email], subject: c.subject, html: c.html, text: c.text }).catch((e) => console.error("[careers] confirmation failed", e));
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[careers] submit failed", e);
    return Response.json({ ok: false, error: "We could not send your application right now. Please email your CV to info@qs-global-solutions.com." }, { status: 502 });
  }
}
