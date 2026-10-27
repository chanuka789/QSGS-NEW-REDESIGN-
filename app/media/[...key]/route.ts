import { readFile } from "node:fs/promises";
import path from "node:path";
import { getObject, storageEnabled } from "@/lib/storage";

export const runtime = "nodejs";

const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", avif: "image/avif", svg: "image/svg+xml" };
const CACHE = "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400";

/** Serves website images from the private bucket's `images/` folder only. */
export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params;
  const file = key.join("/");
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  if (!/^[a-z0-9][a-z0-9._/-]*$/i.test(file) || file.includes("..") || !TYPES[ext]) return new Response("Not found", { status: 404 });

  try {
    if (storageEnabled()) {
      const obj = await getObject(`images/${file}`);
      const body = await obj.Body!.transformToByteArray();
      return new Response(Buffer.from(body), {
        headers: { "Content-Type": obj.ContentType || TYPES[ext], "Cache-Control": CACHE, ...(obj.ETag ? { ETag: obj.ETag } : {}) },
      });
    }
    // Local development fallback: ./media-local/images/<file>
    const buf = await readFile(path.join(process.cwd(), "media-local", "images", file));
    return new Response(buf, { headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=3600" } });
  } catch {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  }
}
