import "server-only";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Railway Storage Bucket (S3-compatible, private).
 * Folders:
 *   images/   public website images, served through /media/<file>
 *   uploads/  visitor uploads (CVs, cover letters, drawings) — never served publicly
 */
const cfg = {
  endpoint: process.env.S3_ENDPOINT,
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION || "auto",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
};

export const storageEnabled = () => !!(cfg.endpoint && cfg.bucket && cfg.accessKeyId && cfg.secretAccessKey);

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
  await s3().send(new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: body, ContentType: contentType, Metadata: metadata }));
  return key;
}

export async function getObject(key: string) {
  const res = await s3().send(new GetObjectCommand({ Bucket: cfg.bucket, Key: key }));
  return res;
}

/** Time-limited private download link (max 7 days for S3 SigV4). */
export function presignedUrl(key: string, seconds = 7 * 24 * 3600) {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: cfg.bucket, Key: key }), { expiresIn: seconds });
}
