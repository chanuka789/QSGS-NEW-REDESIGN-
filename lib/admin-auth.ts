import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Single-owner login for the submissions dashboard.
 *   ADMIN_EMAIL     login email (default info@qs-global-solutions.com)
 *   ADMIN_PASSWORD  login password — set it in Railway; at least 12 characters
 * Sessions are signed cookies valid for 12 hours. The signing key is derived from the
 * password (or ADMIN_SESSION_SECRET), so changing the password signs everyone out.
 */
export const SESSION_COOKIE = "qsgs_admin";
const SESSION_HOURS = 12;

export const adminEmail = () => (process.env.ADMIN_EMAIL || "info@qs-global-solutions.com").trim().toLowerCase();
export const adminConfigured = () => (process.env.ADMIN_PASSWORD || "").length >= 12;

const sha = (s: string) => createHash("sha256").update(s).digest();
const key = () => sha(`qsgs-admin-session:${process.env.ADMIN_SESSION_SECRET || ""}:${process.env.ADMIN_PASSWORD || ""}`);
const sign = (payload: string) => createHmac("sha256", key()).update(payload).digest("base64url");
const same = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

/** Constant-time check of the submitted email and password. */
export function checkCredentials(email: string, password: string) {
  if (!adminConfigured()) return false;
  const okEmail = same(sha(email.trim().toLowerCase()), sha(adminEmail()));
  const okPass = same(sha(password), sha(process.env.ADMIN_PASSWORD!));
  return okEmail && okPass;
}

export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ e: adminEmail(), exp: Date.now() + SESSION_HOURS * 3600_000 })).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !same(Buffer.from(sig), Buffer.from(sign(payload)))) return false;
  try {
    const { e, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e: string; exp: number };
    return e === adminEmail() && exp > Date.now();
  } catch {
    return false;
  }
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

export async function isAdmin() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For dashboard pages: send visitors without a valid session to the login screen. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login/");
}

/** For dashboard API routes: a 401 response when the session is missing, otherwise null. */
export async function adminGuard(req: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "Please sign in again." }, { status: 401 });
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  }
  return null;
}
