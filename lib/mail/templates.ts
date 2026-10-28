import { company, offices } from "@/lib/site";
import { qsJob } from "@/lib/jobs";
import { KIND_LABEL, type Submission } from "@/lib/submissions";

/**
 * Branded, responsive email templates (website look: white, DM Sans, brand blue used sparingly).
 * Built with tables and inline styles so they render in Outlook, Gmail, Apple Mail and on phones.
 *   - adminNotification: to the QSGS inbox, with every field and the files attached
 *   - visitorConfirmation: to the person who submitted the form
 * `base` is the public URL of the site that handled the form (images and dashboard links).
 */

const C = {
  brand: "#046492",
  brandDark: "#034a6c",
  brandSoft: "#eef6fa",
  ink: "#111c24",
  ink2: "#3a4650",
  muted: "#66727c",
  line: "#e3e8ec",
  paper2: "#f5f7f9",
  font: "'DM Sans', Arial, Helvetica, sans-serif",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const nl2br = (s: string) => esc(s).replace(/\r?\n/g, "<br>");
const first = (name: string) => name.trim().split(/\s+/)[0] || name;
const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
export const reference = (s: Pick<Submission, "id">) => `QSGS-${s.id.slice(-8).toUpperCase()}`;

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: process.env.ADMIN_TIMEZONE || "Asia/Colombo" }).format(new Date(iso)) +
  ` (${process.env.ADMIN_TIMEZONE || "Asia/Colombo"})`;

// ───────────────────────────── Building blocks ─────────────────────────────

function button(href: string, label: string, primary = true) {
  const bg = primary ? C.brand : "#ffffff";
  const fg = primary ? "#ffffff" : C.ink;
  const border = primary ? C.brand : C.line;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 8px 0;border-collapse:separate"><tr>
<td align="center" bgcolor="${bg}" style="border-radius:999px;border:1px solid ${border};mso-padding-alt:12px 22px">
<a href="${esc(href)}" target="_blank" style="display:inline-block;padding:12px 22px;font-family:${C.font};font-size:14px;font-weight:600;line-height:20px;color:${fg};text-decoration:none;border-radius:999px">${esc(label)}</a>
</td></tr></table>`;
}

const eyebrow = (t: string) =>
  `<p style="margin:0 0 10px;font-family:${C.font};font-size:12px;line-height:16px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:${C.brand}">${esc(t)}</p>`;

const h1 = (t: string) => `<h1 class="h1" style="margin:0;font-family:${C.font};font-size:26px;line-height:32px;font-weight:500;letter-spacing:-0.02em;color:${C.ink}">${esc(t)}</h1>`;

const para = (html: string, mt = 14) => `<p style="margin:${mt}px 0 0;font-family:${C.font};font-size:15px;line-height:24px;color:${C.ink2}">${html}</p>`;

const sectionTitle = (t: string) =>
  `<p style="margin:30px 0 10px;font-family:${C.font};font-size:12px;line-height:16px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:${C.muted}">${esc(t)}</p>`;

/** Label/value rows that stack on phones. */
function details(rows: [string, string][]) {
  const filled = rows.filter(([, v]) => v && v.trim());
  if (!filled.length) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.ink}">${filled
    .map(
      ([k, v]) => `<tr class="stack">
<td width="36%" valign="top" style="padding:12px 12px 12px 0;border-bottom:1px solid ${C.line};font-family:${C.font};font-size:13px;line-height:20px;color:${C.muted}">${esc(k)}</td>
<td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${C.font};font-size:15px;line-height:22px;color:${C.ink}">${linkify(k, v)}</td></tr>`,
    )
    .join("")}</table>`;
}

function linkify(label: string, v: string) {
  if (label === "Email") return `<a href="mailto:${esc(v)}" style="color:${C.brand};text-decoration:none">${esc(v)}</a>`;
  if (label === "Phone") return `<a href="tel:${esc(v.replace(/[^\d+]/g, ""))}" style="color:${C.brand};text-decoration:none">${esc(v)}</a>`;
  return nl2br(v);
}

const messageBox = (label: string, text: string) =>
  sectionTitle(label) +
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:18px 20px;background:${C.paper2};border-radius:12px;font-family:${C.font};font-size:15px;line-height:24px;color:${C.ink}">${nl2br(text)}</td></tr></table>`;

function filesList(files: Submission["files"], attached?: Set<string>) {
  if (!files.length) return "";
  return (
    sectionTitle(`Files (${files.length})`) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.ink}">${files
      .map((f) => {
        const note = attached ? (attached.has(f.key) ? "Attached to this email" : "Too large to attach — open it in the dashboard") : "Received";
        return `<tr><td style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${C.font}">
<span style="font-size:15px;line-height:22px;color:${C.ink}">${esc(f.name)}</span><br>
<span style="font-size:13px;line-height:20px;color:${C.muted}">${esc(f.label)} · ${kb(f.size)} · ${note}</span></td></tr>`;
      })
      .join("")}</table>`
  );
}

function steps(items: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
    .map(
      ([t, d], i) => `<tr>
<td width="44" valign="top" style="padding:14px 0;border-top:1px solid ${C.line};font-family:${C.font};font-size:14px;line-height:22px;font-weight:600;color:${C.brand}">${String(i + 1).padStart(2, "0")}</td>
<td valign="top" style="padding:14px 0;border-top:1px solid ${C.line};font-family:${C.font}"><span style="font-size:15px;line-height:22px;font-weight:600;color:${C.ink}">${esc(t)}</span><br><span style="font-size:14px;line-height:22px;color:${C.ink2}">${esc(d)}</span></td></tr>`,
    )
    .join("")}</table>`;
}

function contacts() {
  const items = [
    `<a href="mailto:${company.email}" style="color:${C.brand};text-decoration:none">${company.email}</a>`,
    ...offices.filter((o) => o.phone).map((o) => `${esc(o.country)}: <a href="${o.phoneHref}" style="color:${C.ink2};text-decoration:none">${esc(o.phone!)}</a>`),
  ];
  return `<p style="margin:0;font-family:${C.font};font-size:13px;line-height:22px;color:${C.muted}">${items.join(" &nbsp;·&nbsp; ")}</p>`;
}

/** Full email document: preheader, logo header, white card, footer. */
function layout(o: { base: string; title: string; preheader: string; badge?: string; body: string; footer: string }) {
  const logo = `${o.base}/brand/email-logo.png`;
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no">
<title>${esc(o.title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body{margin:0!important;padding:0!important;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
  @media only screen and (max-width:620px){
    .wrap{padding:16px 10px!important}
    .px{padding-left:22px!important;padding-right:22px!important}
    .h1{font-size:22px!important;line-height:28px!important}
    .stack td{display:block!important;width:100%!important;box-sizing:border-box}
    .stack td:first-child{padding-bottom:0!important;border-bottom:0!important}
    .hide-sm{display:none!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper2}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper2}"><tr><td align="center" class="wrap" style="padding:32px 16px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.line};border-radius:16px">
<tr><td class="px" style="padding:26px 36px;border-bottom:1px solid ${C.line}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><a href="${o.base}/" target="_blank"><img src="${logo}" width="164" height="40" alt="${esc(company.name)}" style="display:block;width:164px;height:40px"></a></td>
${o.badge ? `<td valign="middle" align="right" class="hide-sm"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${C.brandSoft};font-family:${C.font};font-size:12px;line-height:16px;font-weight:600;color:${C.brand}">${esc(o.badge)}</span></td>` : ""}
</tr></table></td></tr>
<tr><td class="px" style="padding:34px 36px 36px">${o.body}</td></tr>
<tr><td class="px" style="padding:22px 36px;border-top:1px solid ${C.line};background:#ffffff;border-radius:0 0 16px 16px">${o.footer}</td></tr>
</table>
<p style="margin:18px 0 0;font-family:${C.font};font-size:12px;line-height:18px;color:${C.muted}">© ${new Date().getFullYear()} ${esc(company.name)}</p>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;
}

const textBlock = (rows: [string, string][]) => rows.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v}`).join("\n");

// ───────────────────────────── Admin notification ─────────────────────────────

const ADMIN_HEADLINE: Record<Submission["kind"], (s: Submission) => string> = {
  careers: (s) => `${s.name} applied for ${qsJob.title}`,
  meeting: (s) => `Meeting request from ${s.name}`,
  quote: (s) => `Quotation request from ${s.name}`,
};

export function adminNotification(s: Submission, o: { base: string; attached: Set<string> }) {
  const dashboard = `${o.base}/admin/?open=${encodeURIComponent(s.id)}`;
  const contactRows: [string, string][] = [
    ["Name", s.name],
    ["Email", s.email],
    ["Phone", s.phone ?? ""],
    ["Company", s.company ?? ""],
    ["Country", s.country ?? ""],
  ];
  const headline = ADMIN_HEADLINE[s.kind](s);
  const body =
    eyebrow(`New ${KIND_LABEL[s.kind].toLowerCase()}`) +
    h1(headline) +
    para(`${esc(s.summary)}<br><span style="color:${C.muted};font-size:13px">Received ${esc(when(s.createdAt))} · Ref. ${reference(s)}</span>`) +
    `<div style="margin-top:22px">${button(dashboard, "Open in dashboard")}${button(`mailto:${s.email}?subject=${encodeURIComponent(`Re: your ${KIND_LABEL[s.kind].toLowerCase()} (${reference(s)})`)}`, `Reply to ${first(s.name)}`, false)}</div>` +
    sectionTitle("Contact") +
    details(contactRows) +
    sectionTitle("Details") +
    details(s.fields) +
    (s.message ? messageBox(s.kind === "careers" ? "Additional information" : s.kind === "quote" ? "Project scope" : "Message", s.message) : "") +
    filesList(s.files, o.attached);
  const footer = `<p style="margin:0;font-family:${C.font};font-size:13px;line-height:20px;color:${C.muted}">Sent by the website form at ${esc(o.base.replace(/^https?:\/\//, ""))}. Reply to this email to answer ${esc(first(s.name))} directly. Submission ID: ${esc(s.id)}</p>`;
  const subject =
    s.kind === "careers"
      ? `Job application: ${s.name} — ${qsJob.title}`
      : `${KIND_LABEL[s.kind]}: ${s.name}${s.company ? ` (${s.company})` : ""}`;
  const text = [
    headline,
    s.summary,
    `Received ${when(s.createdAt)} · Ref. ${reference(s)}`,
    "",
    textBlock(contactRows),
    "",
    textBlock(s.fields),
    s.message ? `\n${s.message}` : "",
    s.files.length ? `\nFiles:\n${s.files.map((f) => `- ${f.label}: ${f.name} (${kb(f.size)})${o.attached.has(f.key) ? "" : " — open in dashboard"}`).join("\n")}` : "",
    "",
    `Open in dashboard: ${dashboard}`,
  ].join("\n");
  return { subject, html: layout({ base: o.base, title: subject, preheader: s.summary, badge: KIND_LABEL[s.kind], body, footer }), text };
}

// ───────────────────────────── Visitor confirmation ─────────────────────────────

const NEXT_STEPS: Record<Submission["kind"], [string, string][]> = {
  careers: [
    ["We review your application", "Our team reads every CV and checks your experience against the role."],
    ["Online interview", "If your profile is a good match, we will contact you to arrange an online interview."],
    ["Our decision", "We will let you know the outcome by email."],
  ],
  meeting: [
    ["We confirm the time", "A member of our team will contact you shortly to confirm the meeting time."],
    ["You receive the invitation", "We send an online meeting link for the agreed date and time."],
    ["Share your drawings", "Reply to this email with drawings or documents so we can prepare."],
  ],
  quote: [
    ["We review your scope", "A quantity surveyor reviews your drawings, scope and deadline."],
    ["Questions, if any", "If anything is unclear, we will contact you before pricing."],
    ["You receive your quotation", "A clear quotation with scope, deliverables, delivery date and price."],
  ],
};

const CONFIRM_TITLE: Record<Submission["kind"], (s: Submission) => string> = {
  careers: (s) => `Thank you for applying, ${first(s.name)}.`,
  meeting: (s) => `Thank you, ${first(s.name)}. Your meeting request is in.`,
  quote: (s) => `Thank you, ${first(s.name)}. We have your quotation request.`,
};

const CONFIRM_INTRO: Record<Submission["kind"], string> = {
  careers: `We have received your application for the ${qsJob.title} role at ${company.name}. Here is a copy of what you sent us.`,
  meeting: "We have received your request for an online meeting. Here is a copy of the details you sent us.",
  quote: "We have received your request for a quotation. Here is a copy of the details you sent us.",
};

export function visitorConfirmation(s: Submission, o: { base: string }) {
  const title = CONFIRM_TITLE[s.kind](s);
  const ref = reference(s);
  const body =
    eyebrow(`${KIND_LABEL[s.kind]} received`) +
    h1(title) +
    para(esc(CONFIRM_INTRO[s.kind])) +
    para(`Your reference: <strong style="color:${C.ink}">${ref}</strong>`, 10) +
    sectionTitle("Your submission") +
    details([["Name", s.name], ["Email", s.email], ["Phone", s.phone ?? ""], ["Company", s.company ?? ""], ...s.fields]) +
    (s.message ? messageBox(s.kind === "careers" ? "Additional information" : s.kind === "quote" ? "Project scope" : "Your message", s.message) : "") +
    filesList(s.files) +
    sectionTitle("What happens next") +
    steps(NEXT_STEPS[s.kind]) +
    `<div style="margin-top:28px">${button(`${o.base}/`, "Visit our website")}${button(`mailto:${company.email}?subject=${encodeURIComponent(ref)}`, "Contact us", false)}</div>`;
  const footer =
    contacts() +
    `<p style="margin:10px 0 0;font-family:${C.font};font-size:12px;line-height:18px;color:${C.muted}">You are receiving this email because this address was used on a form at ${esc(o.base.replace(/^https?:\/\//, ""))}. If this was not you, you can ignore this message.</p>`;
  const subject =
    s.kind === "careers"
      ? `Application received — ${qsJob.title} (${ref})`
      : s.kind === "meeting"
        ? `We received your meeting request (${ref})`
        : `We received your quotation request (${ref})`;
  const text = [
    title,
    "",
    CONFIRM_INTRO[s.kind],
    `Your reference: ${ref}`,
    "",
    textBlock([["Name", s.name], ["Email", s.email], ["Phone", s.phone ?? ""], ["Company", s.company ?? ""], ...s.fields]),
    s.message ? `\n${s.message}` : "",
    s.files.length ? `\nFiles received: ${s.files.map((f) => f.name).join(", ")}` : "",
    "",
    "What happens next:",
    ...NEXT_STEPS[s.kind].map(([t, d], i) => `${i + 1}. ${t} — ${d}`),
    "",
    `${company.name} · ${company.email}`,
  ].join("\n");
  return { subject, html: layout({ base: o.base, title: subject, preheader: `${CONFIRM_INTRO[s.kind]} Reference ${ref}.`, body, footer }), text };
}
