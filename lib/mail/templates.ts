import { SITE_URL, company } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

type Row = [label: string, value: string | undefined];

function layout(title: string, intro: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#f4f2ed;font-family:'DM Sans',Arial,sans-serif;color:#10242e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ed;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fbfaf7;border-radius:20px;overflow:hidden;border:1px solid #e6e2d9">
<tr><td style="padding:28px 32px;border-bottom:1px solid #e6e2d9">
<img src="${SITE_URL}/brand/logo-512.png" width="44" height="44" alt="QSGS" style="display:inline-block;vertical-align:middle;border-radius:10px">
<span style="display:inline-block;vertical-align:middle;margin-left:12px;font-size:15px;font-weight:600;color:#046492">${esc(company.name)}</span>
</td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:600;letter-spacing:-0.02em">${esc(title)}</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#69737a">${intro}</p>
${body}
</td></tr>
<tr><td style="padding:20px 32px;background:#10242e;color:#c9d3d8;font-size:12px;line-height:1.6">
${esc(company.name)} · <a href="mailto:${company.email}" style="color:#b5d9ea">${company.email}</a> · <a href="${SITE_URL}" style="color:#b5d9ea">${SITE_URL.replace(/^https?:\/\//, "")}</a>
</td></tr></table></td></tr></table></body></html>`;
}

function table(rows: Row[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #10242e">${rows
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) =>
        `<tr><td style="padding:12px 12px 12px 0;border-bottom:1px solid #e6e2d9;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#69737a;width:34%;vertical-align:top">${esc(k)}</td><td style="padding:12px 0;border-bottom:1px solid #e6e2d9;font-size:15px;line-height:1.55;color:#10242e">${nl2br(v!)}</td></tr>`,
    )
    .join("")}</table>`;
}

const textRows = (rows: Row[]) => rows.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v}`).join("\n");

export function contactNotification(d: Record<string, string>) {
  const rows: Row[] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Company", d.company],
    ["Company type", d.companyType],
    ["Country", d.country],
    ["Service", d.service],
    ["Preferred date", d.date],
    ["Preferred time", d.time ? `${d.time}${d.timezone ? ` (${d.timezone})` : ""}` : ""],
    ["Message", d.message],
  ];
  const title = "New meeting request";
  return {
    subject: `Meeting request — ${d.name}${d.company ? ` (${d.company})` : ""}`,
    html: layout(title, "A new request was submitted through the website contact form. Reply to this email to answer the sender directly.", table(rows)),
    text: `${title}\n\n${textRows(rows)}`,
  };
}

export function contactConfirmation(name: string) {
  const title = `Thank you, ${name.split(" ")[0]}`;
  const intro = "We have received your request and a member of our quantity surveying team will contact you shortly to confirm your online meeting.";
  return {
    subject: "We received your request — Quantity Surveying Global Solutions",
    html: layout(title, esc(intro), `<p style="margin:0;font-size:15px;line-height:1.6">You can also reach us any time at <a href="mailto:${company.email}" style="color:#046492">${company.email}</a>.</p>`),
    text: `${title}\n\n${intro}\n\n${company.email}`,
  };
}

export function careersNotification(d: Record<string, string>, files: string[]) {
  const rows: Row[] = [
    ["Name", `${d.firstName} ${d.lastName}`],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Address", [d.address1, d.city, d.state, d.country].filter(Boolean).join(", ")],
    ["Job type", d.jobType],
    ["Additional information", d.info],
    ["Attachments", files.join("\n")],
  ];
  const title = "New job application — Quantity Surveyor";
  return {
    subject: `Job application — ${d.firstName} ${d.lastName} (${d.jobType})`,
    html: layout(title, "A new application was submitted through the careers page. The CV and cover letter are attached.", table(rows)),
    text: `${title}\n\n${textRows(rows)}`,
  };
}

export function careersConfirmation(firstName: string) {
  const title = `Thank you for applying, ${firstName}`;
  const intro = "We have received your application for the Quantity Surveyor role. Our team will review your CV and contact you if your profile matches our current needs.";
  return {
    subject: "Application received — Quantity Surveying Global Solutions",
    html: layout(title, esc(intro), ""),
    text: `${title}\n\n${intro}`,
  };
}
