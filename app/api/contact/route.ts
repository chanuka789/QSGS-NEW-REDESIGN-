import { contactSchema, fieldErrors } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { inbox, sendMail } from "@/lib/mail";
import { contactConfirmation, contactNotification } from "@/lib/mail/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  const limit = rateLimit(`contact:${clientIp(req)}`, 5);
  if (!limit.ok) return Response.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;

  // Bots: honeypot filled or submitted faster than a human could type → pretend success.
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 2500)) return Response.json({ ok: true });

  const flat = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "")]));
  try {
    const n = contactNotification(flat);
    await sendMail({ to: [inbox("contact")], subject: n.subject, html: n.html, text: n.text, replyTo: { email: d.email, name: d.name } });
    if (process.env.MAIL_SEND_CONFIRMATION !== "false") {
      const c = contactConfirmation(d.name);
      await sendMail({ to: [d.email], subject: c.subject, html: c.html, text: c.text }).catch((e) => console.error("[contact] confirmation failed", e));
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[contact] send failed", e);
    return Response.json({ ok: false, error: "We could not send your message right now. Please email info@qs-global-solutions.com." }, { status: 502 });
  }
}
