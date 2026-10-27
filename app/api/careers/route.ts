import { careersSchema, fieldErrors, FILE_RULES } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { inbox, sendMail, type MailAttachment } from "@/lib/mail";
import { careersConfirmation, careersNotification } from "@/lib/mail/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function safeName(name: string) {
  return name.replace(/[^\w.\- ()]+/g, "_").slice(-120) || "file";
}

async function readFiles(form: FormData, key: string, label: string) {
  const files = form.getAll(key).filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f && (f as File).size > 0);
  if (files.length > FILE_RULES.maxFiles) throw new Error(`You can upload up to ${FILE_RULES.maxFiles} files for the ${label}.`);
  const out: MailAttachment[] = [];
  for (const f of files) {
    const ext = f.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
    if (!(FILE_RULES.extensions as readonly string[]).includes(ext)) throw new Error(`${f.name}: please upload PDF or Word documents only.`);
    if (f.size > FILE_RULES.maxFileBytes) throw new Error(`${f.name} is larger than 5 MB.`);
    const buf = Buffer.from(await f.arrayBuffer());
    // Magic-number check: PDF (%PDF), DOCX (PK zip), DOC (OLE2 D0CF11E0)
    const sig = buf.subarray(0, 4).toString("hex");
    const okSig = (ext === ".pdf" && sig === "25504446") || (ext === ".docx" && sig.startsWith("504b")) || (ext === ".doc" && sig === "d0cf11e0");
    if (!okSig) throw new Error(`${f.name} does not look like a valid ${ext.slice(1).toUpperCase()} file.`);
    out.push({ filename: `${label === "CV" ? "CV" : "Cover-letter"} - ${safeName(f.name)}`, contentType: MIME[ext], content: buf });
  }
  return out;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  const limit = rateLimit(`careers:${clientIp(req)}`, 3);
  if (!limit.ok) return Response.json({ ok: false, error: "Too many applications. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const len = Number(req.headers.get("content-length") || 0);
  if (len > FILE_RULES.maxTotalBytes + 1024 * 1024) return Response.json({ ok: false, error: "Your files are too large. The total limit is 20 MB." }, { status: 413 });

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

  let attachments: MailAttachment[];
  try {
    const cv = await readFiles(form, "resume", "CV");
    if (!cv.length) return Response.json({ ok: false, error: "Please upload your resume.", fields: { resume: "Please upload your resume (PDF or Word)." } }, { status: 422 });
    const cover = await readFiles(form, "coverLetter", "cover letter");
    attachments = [...cv, ...cover];
    if (attachments.reduce((s, a) => s + a.content.length, 0) > FILE_RULES.maxTotalBytes) throw new Error("Your files are too large. The total limit is 20 MB.");
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message, fields: { resume: (e as Error).message } }, { status: 422 });
  }

  const flat = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "")]));
  try {
    const n = careersNotification(flat, attachments.map((a) => a.filename));
    await sendMail({ to: [inbox("careers")], subject: n.subject, html: n.html, text: n.text, replyTo: { email: d.email, name: `${d.firstName} ${d.lastName}` }, attachments });
    if (process.env.MAIL_SEND_CONFIRMATION !== "false") {
      const c = careersConfirmation(d.firstName);
      await sendMail({ to: [d.email], subject: c.subject, html: c.html, text: c.text }).catch((e) => console.error("[careers] confirmation failed", e));
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[careers] send failed", e);
    return Response.json({ ok: false, error: "We could not send your application right now. Please email your CV to info@qs-global-solutions.com." }, { status: 502 });
  }
}
