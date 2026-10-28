import { adminGuard } from "@/lib/admin-auth";
import { deleteSubmission, isSubmissionId, updateSubmission } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Mark read/unread, star, archive or save an internal note. */
export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  if (!isSubmissionId(id)) return Response.json({ ok: false, error: "Not found." }, { status: 404 });
  const patch = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const item = await updateSubmission(id, {
    read: typeof patch.read === "boolean" ? patch.read : undefined,
    starred: typeof patch.starred === "boolean" ? patch.starred : undefined,
    archived: typeof patch.archived === "boolean" ? patch.archived : undefined,
    note: typeof patch.note === "string" ? patch.note : undefined,
  });
  if (!item) return Response.json({ ok: false, error: "Not found." }, { status: 404 });
  return Response.json({ ok: true, item });
}

/** Permanently delete the submission and its files. */
export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  if (!isSubmissionId(id) || !(await deleteSubmission(id))) return Response.json({ ok: false, error: "Not found." }, { status: 404 });
  return Response.json({ ok: true });
}
