import { createChallenge } from "@/lib/captcha";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A fresh human-verification puzzle for the website forms. */
export function GET(req: Request) {
  const limit = rateLimit(`captcha:${clientIp(req)}`, 30);
  if (!limit.ok) return Response.json({ error: "Too many requests." }, { status: 429 });
  return Response.json(createChallenge(), { headers: { "Cache-Control": "no-store" } });
}
