import { adminGuard } from "@/lib/admin-auth";
import { deleteSubmission, isSubmissionId, updateSubmission } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS = {
  read: { read: true },
  unread: { read: false },
  archive: { archived: true },
  unarchive: { archived: false },
  star: { starred: true },
  unstar: { starred: false },
} as const;

/** Apply one action to many submissions: { ids: string[], action: "read" | … | "delete" }. */
export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { ids, action } = (await req.json().catch(() => ({}))) as { ids?: unknown; action?: string };
  const list = Array.isArray(ids) ? ids.filter((x): x is string => typeof x === "string" && isSubmissionId(x)).slice(0, 500) : [];
  if (!list.length || !action || !(action === "delete" || action in ACTIONS)) return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  for (let i = 0; i < list.length; i += 10) {
    await Promise.all(list.slice(i, i + 10).map((id) => (action === "delete" ? deleteSubmission(id) : updateSubmission(id, ACTIONS[action as keyof typeof ACTIONS]))));
  }
  return Response.json({ ok: true, count: list.length });
}
