# Quantity Surveying Global Solutions — Website

Redesigned company website for **Quantity Surveying Global Solutions (QSGS)**.

- **Next.js 16** (App Router, static pre-rendering) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **DM Sans** (Arial / sans-serif fallback) · light mode only
- **Three.js** (React Three Fiber + drei): 3D building model with *Design / Exploded / Rotate* views, interactive globe
- **Liquid glass** UI: floating island header, glass controls, forms and menus (real refraction in desktop Chromium, frosted glass elsewhere)
- **Motion** + **Lenis**: smooth scrolling, parallax, scroll-driven "scale-rule" service timeline, reveals
- Contact + careers forms with email delivery through **Microsoft 365** (Microsoft Graph or SMTP)
- Full SEO: original titles/descriptions, canonical URLs, Open Graph images, JSON-LD (Organization, Service, JobPosting, Breadcrumbs), sitemap, robots

All original URLs are kept (with trailing slash), so existing Google rankings carry over.

| Page | URL |
| --- | --- |
| Home | `/` |
| About us | `/about-us/` |
| Our services | `/our-services/` |
| Cost consultant firms | `/our-quantity-surveying-remote-services-for-consultant-firms-qs-qlobal-solutions/` |
| Property developers / clients | `/quantity-surveying-services-for-property-developers-clients/` |
| Contractors | `/our-services-for-contractors/` |
| Architects firms | `/quantity-surveying-remote-services-for-independant-architects/` |
| Careers | `/careers/` |
| Our team | `/highly-qualified-quantity-surveyors-leading-qs-outsource-company/` |
| Contact | `/contact-us-quantity-surveying-global-solutions/` |
| Privacy policy (new) | `/privacy-policy/` |

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — without email settings, emails are printed to the console in dev
npm run dev                  # http://localhost:3000
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

## Email setup (Microsoft 365)

Form submissions go to `MAIL_TO` (default `info@qs-global-solutions.com`), and the visitor gets a confirmation email.

### Option A — Microsoft Graph (recommended)

Microsoft is switching off password-based SMTP (Basic Auth) by default for Exchange Online from late 2026, so OAuth via Graph is the future-proof choice.

1. Azure Portal → **Microsoft Entra ID** → **App registrations** → **New registration** (single tenant).
2. **Certificates & secrets** → **New client secret** → copy the value.
3. **API permissions** → **Add a permission** → **Microsoft Graph** → **Application permissions** → `Mail.Send` → **Grant admin consent**.
4. (Recommended) Limit the app to the sending mailbox only, using an Exchange *application access policy* / *RBAC for Applications*.
5. Set the variables:

```
MAIL_PROVIDER=graph
MAIL_FROM=info@qs-global-solutions.com
MAIL_TO=info@qs-global-solutions.com
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
```

CV attachments larger than 3 MB are uploaded with Graph upload sessions automatically (limit: 4 files × 5 MB per field, 20 MB total).

### Option B — SMTP

```
MAIL_PROVIDER=smtp
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_AUTH=login            # or oauth2 (uses the Azure app above + SMTP.SendAsApp)
SMTP_USER=info@qs-global-solutions.com
SMTP_PASS=...
```

For `login`, *Authenticated SMTP* must be enabled for the mailbox in the Microsoft 365 admin center.

## Deploy on Railway

`railway.json` configures the build (`npm run build`), start (`npm run start`, listens on `$PORT`) and health check (`/api/health/`).

Set these service variables in Railway: `NEXT_PUBLIC_SITE_URL`, the email variables above, and the bucket references from `.env.example`. Then add the custom domain `qs-global-solutions.com` in **Settings → Networking** and update DNS at your domain registrar.

## Images and file storage (Railway bucket `qsgs-media`)

The bucket is private. It has two folders:

| Folder | Contents | Public? |
| --- | --- | --- |
| `images/` | Website images, named `qsgs-<sector>-<nn>.webp` (for example `qsgs-residential-05.webp`) | Served through `/media/<file>`, then resized and cached by Next.js |
| `uploads/careers/…`, `uploads/contact/…` | CVs, cover letters and drawings sent through the forms (PDF, DOC, DOCX, JPG, PNG, WEBP · 5 MB per file · up to 4 files) | Never public. The notification email includes the files plus 7-day private download links |

All website images are listed in `lib/media.ts` (file, sector, title, alt text). **To replace an image**, upload a new file with the same name. Either use the bucket's **Files** tab in the Railway dashboard (put it in `images/`), or run:

```bash
curl -X PUT -H "Authorization: Bearer $MEDIA_UPLOAD_TOKEN" \
  --data-binary @qsgs-residential-05.webp \
  "https://<your-site>/api/admin/media/?file=qsgs-residential-05.webp"
```

To add a new image, upload it the same way, then add a line for it in `lib/media.ts`.

Text content lives in `lib/site.ts` (company details, offices, navigation), `lib/services.ts` (all services) and `lib/jobs.ts` (vacancy — update `datePosted` when the role is re-opened).
