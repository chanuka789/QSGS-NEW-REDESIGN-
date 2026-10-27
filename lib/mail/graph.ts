import "server-only";
import type { MailMessage } from "./types";

/**
 * Microsoft Graph sender (Microsoft 365 / Exchange Online, OAuth 2.0 client credentials).
 * Requires an Azure app registration with the *Application* permission `Mail.Send`
 * (admin consent granted). The mailbox in MAIL_FROM is used as the sender.
 */

const GRAPH = "https://graph.microsoft.com/v1.0";
const INLINE_LIMIT = 3 * 1024 * 1024; // Graph inline attachment limit per request
const CHUNK = 320 * 1024 * 10; // 3.125 MiB (must be a multiple of 320 KiB)

let cached: { token: string; exp: number } | null = null;

export async function getAzureToken(scope: string) {
  const tenant = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const secret = process.env.AZURE_CLIENT_SECRET;
  if (!tenant || !clientId || !secret) throw new Error("Azure credentials are not configured (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET).");
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: secret, scope, grant_type: "client_credentials" }),
    cache: "no-store",
  });
  const json = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !json.access_token) throw new Error(`Azure token request failed: ${json.error_description ?? res.status}`);
  return { token: json.access_token, expiresIn: json.expires_in ?? 3600 };
}

async function graphToken() {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const { token, expiresIn } = await getAzureToken("https://graph.microsoft.com/.default");
  cached = { token, exp: Date.now() + expiresIn * 1000 };
  return token;
}

async function call(path: string, init: RequestInit & { json?: unknown }) {
  const token = await graphToken();
  const res = await fetch(`${GRAPH}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) },
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Microsoft Graph ${init.method ?? "GET"} ${path} failed (${res.status}): ${detail.slice(0, 500)}`);
  }
  return res;
}

function graphMessage(m: MailMessage, fromName?: string) {
  return {
    subject: m.subject,
    body: { contentType: "HTML", content: m.html },
    toRecipients: m.to.map((address) => ({ emailAddress: { address } })),
    ...(m.replyTo ? { replyTo: [{ emailAddress: { address: m.replyTo.email, name: m.replyTo.name } }] } : {}),
    ...(fromName ? { from: { emailAddress: { address: process.env.MAIL_FROM, name: fromName } } } : {}),
  };
}

export async function sendWithGraph(m: MailMessage) {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM is not configured.");
  const user = `/users/${encodeURIComponent(from)}`;
  const fromName = process.env.MAIL_FROM_NAME;
  const attachments = m.attachments ?? [];
  const total = attachments.reduce((s, a) => s + a.content.length, 0);

  // Small payloads: one request.
  if (total < INLINE_LIMIT) {
    await call(`${user}/sendMail`, {
      method: "POST",
      json: {
        message: {
          ...graphMessage(m, fromName),
          attachments: attachments.map((a) => ({
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: a.filename,
            contentType: a.contentType,
            contentBytes: a.content.toString("base64"),
          })),
        },
        saveToSentItems: true,
      },
    });
    return;
  }

  // Larger payloads: draft → attachments (upload sessions for big files) → send.
  const draft = (await (await call(`${user}/messages`, { method: "POST", json: graphMessage(m, fromName) })).json()) as { id: string };
  const msg = `${user}/messages/${draft.id}`;
  for (const a of attachments) {
    if (a.content.length < INLINE_LIMIT) {
      await call(`${msg}/attachments`, {
        method: "POST",
        json: { "@odata.type": "#microsoft.graph.fileAttachment", name: a.filename, contentType: a.contentType, contentBytes: a.content.toString("base64") },
      });
      continue;
    }
    const session = (await (
      await call(`${msg}/attachments/createUploadSession`, {
        method: "POST",
        json: { AttachmentItem: { attachmentType: "file", name: a.filename, size: a.content.length, contentType: a.contentType } },
      })
    ).json()) as { uploadUrl: string };
    for (let start = 0; start < a.content.length; start += CHUNK) {
      const end = Math.min(start + CHUNK, a.content.length);
      const res = await fetch(session.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream", "Content-Length": String(end - start), "Content-Range": `bytes ${start}-${end - 1}/${a.content.length}` },
        body: new Uint8Array(a.content.subarray(start, end)),
      });
      if (!res.ok) throw new Error(`Attachment upload failed (${res.status})`);
    }
  }
  await call(`${msg}/send`, { method: "POST" });
}
