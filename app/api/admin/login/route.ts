import { cookies } from "next/headers";
import { adminConfigured, checkCredentials, cookieOptions, createSessionToken, SESSION_COOKIE } from "@/lib/admin-auth";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  if (!adminConfigured()) return Response.json({ ok: false, error: "The dashboard is not set up yet. Add ADMIN_PASSWORD (12+ characters) in Railway." }, { status: 503 });
  // 5 attempts per 15 minutes per IP (plus a high overall cap that a botnet cannot use to lock you out quickly).
  const ip = rateLimit(`login:${clientIp(req)}`, 5, 15 * 60_000);
  const all = rateLimit("login:all", 100, 15 * 60_000);
  if (!ip.ok || !all.ok) return Response.json({ ok: false, error: "Too many attempts. Please wait 15 minutes and try again." }, { status: 429 });

  // JSON from the sign-in screen, or a plain form post if the page's script has not loaded yet.
  const isForm = !(req.headers.get("content-type") || "").includes("application/json");
  let body: { email?: string; password?: string };
  try {
    body = isForm ? (Object.fromEntries((await req.formData()).entries()) as { email?: string; password?: string }) : await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const email = String(body.email ?? "").slice(0, 200);
  const password = String(body.password ?? "").slice(0, 500);
  // Small fixed delay makes password guessing slower.
  await new Promise((r) => setTimeout(r, 400));
  const ok = checkCredentials(email, password);
  if (ok) {
    const { token, maxAge } = createSessionToken();
    (await cookies()).set(SESSION_COOKIE, token, cookieOptions(maxAge));
  }
  if (isForm) return new Response(null, { status: 303, headers: { Location: ok ? "/admin/" : "/admin/login/?error=1" } });
  if (!ok) return Response.json({ ok: false, error: "The email or password is incorrect." }, { status: 401 });
  return Response.json({ ok: true });
}
