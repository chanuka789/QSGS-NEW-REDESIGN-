import { adminGuard } from "@/lib/admin-auth";
import { getSubmission } from "@/lib/submissions";
import { getObjectBuffer } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Private file download for the dashboard: ?id=<submission>&i=<file index>[&download=1]. */
export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const s = await getSubmission(url.searchParams.get("id") ?? "");
  const f = s?.files[Number(url.searchParams.get("i"))];
  if (!s || !f) return new Response("Not found", { status: 404 });
  const buf = await getObjectBuffer(f.key);
  if (!buf) return new Response("File is no longer in storage", { status: 404 });
  const inline = url.searchParams.get("download") !== "1" && /^(application\/pdf|image\/)/.test(f.contentType);
  const ascii = f.name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": f.contentType,
      "Content-Length": String(buf.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(f.name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
