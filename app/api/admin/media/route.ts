import { timingSafeEqual } from "node:crypto";
import { putObject, storageEnabled } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", avif: "image/avif" };

function authorised(req: Request) {
  const token = process.env.MEDIA_UPLOAD_TOKEN;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token || token.length < 32 || given.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(token));
}

/**
 * Admin-only image upload into the bucket's `images/` folder.
 *   curl -X PUT -H "Authorization: Bearer $MEDIA_UPLOAD_TOKEN" \
 *        --data-binary @qsgs-residential-01.webp \
 *        "https://<site>/api/admin/media/?file=qsgs-residential-01.webp"
 * Disabled unless MEDIA_UPLOAD_TOKEN (32+ characters) is set.
 */
export async function PUT(req: Request) {
  if (!authorised(req)) return new Response("Unauthorized", { status: 401 });
  if (!storageEnabled()) return new Response("Storage not configured", { status: 503 });
  const file = new URL(req.url).searchParams.get("file") ?? "";
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  if (!/^qsgs-[a-z0-9-]+\.(webp|jpe?g|png|avif)$/.test(file) || !TYPES[ext]) return new Response("File name must look like qsgs-<sector>-<nn>.webp", { status: 400 });
  const body = Buffer.from(await req.arrayBuffer());
  if (!body.length || body.length > 15 * 1024 * 1024) return new Response("Empty or too large (max 15 MB)", { status: 413 });
  await putObject(`images/${file}`, body, TYPES[ext]);
  return Response.json({ ok: true, key: `images/${file}`, url: `/media/${file}` });
}
