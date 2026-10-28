import "server-only";
import { randomBytes } from "node:crypto";
import { deleteObjects, getObjectBuffer, listKeys, putObject, storageAvailable } from "./storage";

/**
 * Form submissions, stored as one JSON record each in the private bucket:
 *   submissions/<id>.json
 * Their files live in uploads/<kind>/<id>/. The admin dashboard reads and updates these.
 */
export type SubmissionKind = "careers" | "meeting" | "quote";

export const KIND_LABEL: Record<SubmissionKind, string> = {
  careers: "Job application",
  meeting: "Meeting request",
  quote: "Quotation request",
};

export type SubmissionFile = { name: string; label: string; key: string; size: number; contentType: string };

export type Submission = {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  /** One-line summary shown in the inbox list. */
  summary: string;
  /** Ordered details exactly as shown in emails and the dashboard. */
  fields: [label: string, value: string][];
  message?: string;
  files: SubmissionFile[];
  read: boolean;
  starred: boolean;
  archived: boolean;
  note: string;
  mail: { notified: boolean; confirmed: boolean; error?: string };
};

const ID_RE = /^\d{8}-\d{6}-(careers|meeting|quote)-[a-f0-9]{8}$/;
export const isSubmissionId = (id: string) => ID_RE.test(id);
const keyOf = (id: string) => `submissions/${id}.json`;

/** Sortable id: 20261028-143005-quote-1a2b3c4d */
export function newSubmissionId(kind: SubmissionKind) {
  const iso = new Date().toISOString();
  return `${iso.slice(0, 10).replace(/-/g, "")}-${iso.slice(11, 19).replace(/:/g, "")}-${kind}-${randomBytes(4).toString("hex")}`;
}

export async function saveSubmission(s: Submission) {
  if (!storageAvailable()) throw new Error("Storage bucket is not configured.");
  await putObject(keyOf(s.id), Buffer.from(JSON.stringify(s, null, 1)), "application/json");
}

export async function getSubmission(id: string): Promise<Submission | null> {
  if (!isSubmissionId(id)) return null;
  const buf = await getObjectBuffer(keyOf(id));
  return buf ? (JSON.parse(buf.toString("utf8")) as Submission) : null;
}

/** Every submission, newest first. */
export async function listSubmissions(): Promise<Submission[]> {
  if (!storageAvailable()) return [];
  const keys = (await listKeys("submissions/")).filter((k) => k.endsWith(".json"));
  const out: Submission[] = [];
  for (let i = 0; i < keys.length; i += 25) {
    const batch = await Promise.all(keys.slice(i, i + 25).map((k) => getObjectBuffer(k).catch(() => null)));
    for (const b of batch) {
      if (!b) continue;
      try {
        out.push(JSON.parse(b.toString("utf8")) as Submission);
      } catch {
        /* skip unreadable records */
      }
    }
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type SubmissionPatch = Partial<Pick<Submission, "read" | "starred" | "archived" | "note">>;

export async function updateSubmission(id: string, patch: SubmissionPatch) {
  const s = await getSubmission(id);
  if (!s) return null;
  const next: Submission = { ...s };
  if (typeof patch.read === "boolean") next.read = patch.read;
  if (typeof patch.starred === "boolean") next.starred = patch.starred;
  if (typeof patch.archived === "boolean") next.archived = patch.archived;
  if (typeof patch.note === "string") next.note = patch.note.slice(0, 5000);
  await saveSubmission(next);
  return next;
}

/** Deletes the record and all of its uploaded files. */
export async function deleteSubmission(id: string) {
  const s = await getSubmission(id);
  if (!s) return false;
  await deleteObjects([...s.files.map((f) => f.key), keyOf(id)]);
  return true;
}
