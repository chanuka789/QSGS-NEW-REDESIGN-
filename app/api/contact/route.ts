import { contactSchema, fieldErrors, FILE_RULES } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { verifySolution } from "@/lib/captcha";
import { processSubmission, publicBase } from "@/lib/submit";
import { readUploads, UploadError, type UploadedFile } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const day = (d: string) => (d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "");

/** Contact page: meeting requests and quotation requests (multipart, optional attachments). */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  const limit = rateLimit(`contact:${clientIp(req)}`, 5);
  if (!limit.ok) return Response.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const len = Number(req.headers.get("content-length") || 0);
  if (len > FILE_RULES.maxTotalBytes + 1024 * 1024) return Response.json({ ok: false, error: "Your files are too large. Each file can be up to 5 MB." }, { status: 413 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const raw: Record<string, unknown> = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  raw.consent = raw.consent === "true" || raw.consent === "on";

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;
  // Bots: honeypot filled or submitted faster than a human could type → pretend success.
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 2500)) return Response.json({ ok: true });
  if (!verifySolution(d.captcha)) return Response.json({ ok: false, error: "Please complete the human verification.", fields: { captcha: "Please verify that you are human." } }, { status: 422 });

  let files: UploadedFile[] = [];
  try {
    files = await readUploads(form, "attachments", d.requestType === "quote" ? "Drawings / documents" : "Attachment");
  } catch (e) {
    if (e instanceof UploadError) return Response.json({ ok: false, error: e.message, fields: { attachments: e.message } }, { status: 422 });
    throw e;
  }

  const quote = d.requestType === "quote";
  const time = d.time ? `${d.time}${d.timezone ? ` (${d.timezone})` : ""}` : "";
  const fields: [string, string][] = quote
    ? [
        ["Project", d.projectName],
        ["Project type", d.projectType],
        ["Project location", d.projectLocation],
        ["Service required", d.service],
        ["Required by", day(d.deadline)],
        ["Company type", d.companyType],
        ["Country", d.country],
      ]
    : [
        ["Preferred date", day(d.date)],
        ["Preferred time", time],
        ["Service of interest", d.service],
        ["Company type", d.companyType],
        ["Country", d.country],
        ["Visitor time zone", d.timezone],
      ];
  const summary = quote
    ? [d.projectName || d.projectType, d.service, d.projectLocation || d.country, d.deadline && `due ${day(d.deadline)}`].filter(Boolean).join(" · ")
    : [d.date ? `Preferred ${day(d.date)}${time ? `, ${time}` : ""}` : "No preferred time given", d.service, d.country].filter(Boolean).join(" · ");

  const result = await processSubmission(
    quote ? "quote" : "meeting",
    { kind: quote ? "quote" : "meeting", name: d.name, email: d.email, phone: d.phone, company: d.company, country: d.country, summary, fields, message: d.message },
    files,
    publicBase(req),
  );
  if (!result.ok) return Response.json({ ok: false, error: "We could not send your request right now. Please email info@qs-global-solutions.com." }, { status: 502 });
  return Response.json({ ok: true });
}
