import { careersSchema, fieldErrors, FILE_RULES } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { verifySolution } from "@/lib/captcha";
import { processSubmission, publicBase } from "@/lib/submit";
import { qsJob } from "@/lib/jobs";
import { readUploads, UploadError, type UploadedFile } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Careers page: job applications with CV (required) and cover letter (optional). */
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
  if (!verifySolution(d.captcha)) return Response.json({ ok: false, error: "Please complete the human verification.", fields: { captcha: "Please verify that you are human." } }, { status: 422 });

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
  const address = [d.address1, d.city, d.state, d.country].filter(Boolean).join(", ");
  const result = await processSubmission(
    "careers",
    {
      kind: "careers",
      name,
      email: d.email,
      phone: d.phone,
      country: d.country,
      summary: [qsJob.title, d.jobType, d.country, `${files.length} file${files.length === 1 ? "" : "s"}`].filter(Boolean).join(" · "),
      fields: [
        ["Position", qsJob.title],
        ["Job type", d.jobType],
        ["Address", address],
      ],
      message: d.info,
    },
    files,
    publicBase(req),
  );
  if (!result.ok) return Response.json({ ok: false, error: "We could not send your application right now. Please email your CV to info@qs-global-solutions.com." }, { status: 502 });
  return Response.json({ ok: true });
}
