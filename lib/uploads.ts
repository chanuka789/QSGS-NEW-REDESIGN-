import "server-only";
import { FILE_RULES } from "./form-rules";
import { putObject, storageAvailable } from "./storage";
import type { SubmissionFile } from "./submissions";
import type { MailAttachment } from "./mail";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Checks the file's real content (magic bytes), not just its name. */
function signatureOk(ext: string, buf: Buffer) {
  const hex = buf.subarray(0, 4).toString("hex");
  switch (ext) {
    case ".pdf":
      return hex === "25504446";
    case ".docx":
      return hex.startsWith("504b");
    case ".doc":
      return hex === "d0cf11e0";
    case ".jpg":
    case ".jpeg":
      return hex.startsWith("ffd8ff");
    case ".png":
      return hex === "89504e47";
    case ".webp":
      return hex === "52494646" && buf.subarray(8, 12).toString("ascii") === "WEBP";
    default:
      return false;
  }
}

const safeName = (name: string) => name.replace(/[^\w.\- ()]+/g, "_").replace(/\s+/g, " ").slice(-120) || "file";

export type UploadedFile = MailAttachment & { label: string };

export class UploadError extends Error {}

/** Reads and validates the files of one form field. */
export async function readUploads(form: FormData, field: string, label: string): Promise<UploadedFile[]> {
  const files = form.getAll(field).filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f && (f as File).size > 0);
  if (files.length > FILE_RULES.maxFiles) throw new UploadError(`You can upload up to ${FILE_RULES.maxFiles} files for the ${label}.`);
  const out: UploadedFile[] = [];
  for (const f of files) {
    const ext = f.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
    if (!(FILE_RULES.extensions as readonly string[]).includes(ext)) throw new UploadError(`${f.name}: please upload PDF, Word or image files only.`);
    if (f.size > FILE_RULES.maxFileBytes) throw new UploadError(`${f.name} is larger than 5 MB.`);
    const buf = Buffer.from(await f.arrayBuffer());
    if (!signatureOk(ext, buf)) throw new UploadError(`${f.name} does not look like a valid ${ext.slice(1).toUpperCase()} file.`);
    out.push({ filename: safeName(f.name), contentType: MIME[ext], content: buf, label });
  }
  return out;
}

/**
 * Saves visitor uploads in the private bucket under uploads/<kind>/<submission-id>/.
 * Returns references for the submission record (the files are opened from the dashboard).
 */
export async function storeUploads(kind: "careers" | "meeting" | "quote", submissionId: string, files: UploadedFile[], meta: Record<string, string>): Promise<SubmissionFile[]> {
  if (!files.length) return [];
  if (!storageAvailable()) throw new Error("Storage bucket is not configured.");
  const ascii = (v: string) => v.replace(/[^\x20-\x7e]/g, "?").slice(0, 200);
  return Promise.all(
    files.map(async (f, i) => {
      const key = `uploads/${kind}/${submissionId}/${String(i + 1).padStart(2, "0")}-${f.filename}`;
      await putObject(key, f.content, f.contentType, Object.fromEntries(Object.entries({ ...meta, label: f.label }).map(([k, v]) => [k, ascii(v)])));
      return { name: f.filename, label: f.label, key, size: f.content.length, contentType: f.contentType };
    }),
  );
}
