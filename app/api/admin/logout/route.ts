import { cookies } from "next/headers";
import { cookieOptions, SESSION_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  (await cookies()).set(SESSION_COOKIE, "", cookieOptions(0));
  return Response.json({ ok: true });
}
