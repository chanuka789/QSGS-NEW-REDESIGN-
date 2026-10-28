import { adminGuard } from "@/lib/admin-auth";
import { KIND_LABEL, listSubmissions, type SubmissionKind } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cell = (v: string) => {
  const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

/** CSV export of all submissions (or one type with ?kind=careers|meeting|quote). */
export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const kind = new URL(req.url).searchParams.get("kind") as SubmissionKind | null;
  const items = (await listSubmissions()).filter((s) => !kind || s.kind === kind);
  const head = ["Received (UTC)", "Type", "Name", "Email", "Phone", "Company", "Country", "Summary", "Details", "Message", "Files", "Read", "Starred", "Archived", "Note", "ID"];
  const rows = items.map((s) => [
    s.createdAt.replace("T", " ").slice(0, 19),
    KIND_LABEL[s.kind],
    s.name,
    s.email,
    s.phone ?? "",
    s.company ?? "",
    s.country ?? "",
    s.summary,
    s.fields.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("; "),
    s.message ?? "",
    s.files.map((f) => f.name).join("; "),
    s.read ? "yes" : "no",
    s.starred ? "yes" : "no",
    s.archived ? "yes" : "no",
    s.note,
    s.id,
  ]);
  const csv = "﻿" + [head, ...rows].map((r) => r.map((c) => cell(String(c))).join(",")).join("\r\n");
  const name = `qsgs-submissions-${kind ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" } });
}
