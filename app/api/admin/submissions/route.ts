import { adminGuard } from "@/lib/admin-auth";
import { listSubmissions } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  return Response.json({ ok: true, items: await listSubmissions() }, { headers: { "Cache-Control": "no-store" } });
}
