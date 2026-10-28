import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Railway Storage Bucket (S3-compatible, private).
 * Folders:
 *   images/       public website images, served through /media/<file>
 *   uploads/      visitor uploads (CVs, cover letters, drawings) — never served publicly
 *   submissions/  one JSON record per form submission (read by the admin dashboard)
 * In development without bucket variables, objects are kept in ./.data-local instead.
 */
const cfg = {
  endpoint: process.env.S3_ENDPOINT,
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION || "auto",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
};

export const storageEnabled = () => !!(cfg.endpoint && cfg.bucket && cfg.accessKeyId && cfg.secretAccessKey);
/** Local folder stand-in for the bucket (development only). */
const localMode = () => !storageEnabled() && (process.env.NODE_ENV !== "production" || process.env.STORAGE_LOCAL === "true");
/** True when objects can be saved somewhere (bucket, or the local dev folder). */
export const storageAvailable = () => storageEnabled() || localMode();

const LOCAL_ROOT = path.join(process.cwd(), ".data-local");
const localPath = (key: string) => {
  const p = path.join(LOCAL_ROOT, key);
  if (!p.startsWith(LOCAL_ROOT + path.sep)) throw new Error("Invalid key");
  return p;
};

let client: S3Client | null = null;
function s3() {
  if (!storageEnabled()) throw new Error("Storage bucket is not configured (S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY).");
  client ??= new S3Client({
    endpoint: cfg.endpoint,
    region: cfg.region,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: { accessKeyId: cfg.accessKeyId!, secretAccessKey: cfg.secretAccessKey! },
  });
  return client;
}

export async function putObject(key: string, body: Buffer, contentType: string, metadata?: Record<string, string>) {
  if (localMode()) {
    await fs.mkdir(path.dirname(localPath(key)), { recursive: true });
    await fs.writeFile(localPath(key), body);
    return key;
  }
  await s3().send(new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: body, ContentType: contentType, Metadata: metadata }));
  return key;
}

export async function getObject(key: string) {
  const res = await s3().send(new GetObjectCommand({ Bucket: cfg.bucket, Key: key }));
  return res;
}

/** Whole object as a Buffer, or null when it does not exist. */
export async function getObjectBuffer(key: string): Promise<Buffer | null> {
  try {
    if (localMode()) return await fs.readFile(localPath(key));
    const res = await getObject(key);
    return Buffer.from(await res.Body!.transformToByteArray());
  } catch (e) {
    const code = (e as { name?: string; code?: string }).name ?? (e as { code?: string }).code;
    if (code === "NoSuchKey" || code === "ENOENT" || code === "NotFound") return null;
    throw e;
  }
}

/** All keys under a prefix (paginates through the bucket listing). */
export async function listKeys(prefix: string): Promise<string[]> {
  if (localMode()) {
    const dir = path.join(LOCAL_ROOT, prefix);
    if (!dir.startsWith(LOCAL_ROOT)) throw new Error("Invalid prefix");
    const walk = async (d: string): Promise<string[]> => {
      const entries = await fs.readdir(d, { withFileTypes: true }).catch(() => []);
      const nested = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])));
      return nested.flat();
    };
    return (await walk(dir)).map((p) => path.relative(LOCAL_ROOT, p).split(path.sep).join("/"));
  }
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const res = await s3().send(new ListObjectsV2Command({ Bucket: cfg.bucket, Prefix: prefix, ContinuationToken: token }));
    for (const o of res.Contents ?? []) if (o.Key) keys.push(o.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

export async function deleteObjects(keys: string[]) {
  if (!keys.length) return;
  if (localMode()) {
    await Promise.all(keys.map((k) => fs.rm(localPath(k), { force: true })));
    return;
  }
  for (let i = 0; i < keys.length; i += 1000) {
    await s3().send(new DeleteObjectsCommand({ Bucket: cfg.bucket, Delete: { Objects: keys.slice(i, i + 1000).map((Key) => ({ Key })), Quiet: true } }));
  }
}

/** Time-limited private download link (max 7 days for S3 SigV4). */
export function presignedUrl(key: string, seconds = 7 * 24 * 3600) {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: cfg.bucket, Key: key }), { expiresIn: seconds });
}
