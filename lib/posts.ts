import { img } from "./media";
import { landingRoutes } from "./landing";
import { routes } from "./site";

/**
 * Insights posts. Each post is served at the root, at /<slug>/ (old WordPress URLs are kept),
 * rendered by app/[post]/page.tsx with the shared responsive post template, and listed on
 * /insights/, in the sitemap and in structured data. To add a post, add an entry to `posts`.
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: { title?: string; text: string }[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "links"; items: { label: string; href: string }[] };

export type Post = {
  slug: string;
  path: string;
  category: string;
  /** Full headline (structured data). */
  title: string;
  h1: string;
  lead: string;
  /** One or two sentences for the Insights list. */
  excerpt: string;
  seo: { title: string; description: string };
  published: string;
  updated: string;
  image: { src: string; alt: string };
  blocks: ArticleBlock[];
  /** Service / location pages to suggest after the post. */
  related: string[];
};

/** Published on the old website on 31 May 2025, rewritten for the new site. */
const uaeGuide: Post = {
  slug: landingRoutes.article.replace(/\//g, ""),
  path: landingRoutes.article,
  category: "Guide",
  excerpt: "What remote quantity surveying is, what you can outsource, and how UAE developers, consultants, contractors and architects use it to control cost.",
  related: [landingRoutes.uae, landingRoutes.boq, landingRoutes.takeoff, routes.consultants],
  title: "Remote quantity surveying services in the UAE: how they work and why they save cost",
  h1: "Expert remote quantity surveying services in the UAE",
  lead: "How remote quantity surveying works, what you can outsource, and how UAE developers, consultants, contractors and architects use it to control cost.",
  seo: {
    title: "Remote Quantity Surveying in the UAE: A Guide | QSGS",
    description:
      "How remote quantity surveying works in the UAE: take-offs, BOQ preparation, revisions and tender documents for developers, consultants, contractors and architects.",
  },
  published: "2025-05-31",
  updated: "2026-10-28",
  image: { src: img("qsgs-mixed-use-01.webp").src, alt: img("qsgs-mixed-use-01.webp").alt },
  blocks: [
    { type: "h2", id: "what-is-remote-qs", text: "What is remote quantity surveying?" },
    {
      type: "p",
      text: "Remote quantity surveying means your take-offs, Bills of Quantities (BoQs), revisions and tender documents are prepared by qualified quantity surveyors who work from your drawings and models, rather than from a desk in your office or on site. You share the design information online; the team returns measured quantities and documents in your format.",
    },
    {
      type: "p",
      text: "For UAE projects, where tender periods are short and designs often change late, this gives developers, consultants and contractors extra capacity exactly when they need it — without the cost of permanent hires.",
    },
    { type: "h2", id: "advantages", text: "The advantages of a remote QS team" },
    {
      type: "list",
      items: [
        { title: "Expertise and experience", text: "Access graduate quantity surveyors with experience across the Gulf region, the UK, Australia and New Zealand, wherever your project is." },
        { title: "Cost savings", text: "No travel, desks or on-site overheads. You pay for the output you need." },
        { title: "Efficiency", text: "Modern measurement software and focused teams give faster turnaround and fewer errors." },
        { title: "Flexibility", text: "Scale support up for a tender peak and down again afterwards." },
        { title: "Global reach", text: "We support projects in more than 20 countries, with contacts in the UAE, Kuwait, Australia and Sri Lanka." },
      ],
    },
    { type: "h2", id: "services", text: "What you can outsource" },
    { type: "h3", text: "2D and 3D quantity take-offs" },
    {
      type: "p",
      text: "Quantities measured from PDF and AutoCAD drawings and from Revit models, using Revit, Bluebeam, AutoCAD and PlanSwift. You receive take-off sheets and, when needed, marked-up drawings that show what was measured.",
    },
    { type: "links", items: [{ label: "Quantity take-off services", href: landingRoutes.takeoff }] },
    { type: "h3", text: "Bill of Quantities (BoQ) preparation" },
    {
      type: "p",
      text: "Complete BoQs with precise quantities, following the drawings, the specifications and the standard method of measurement. We cover architectural, structural, M&E, infrastructure, landscape, irrigation, ICT, security systems and data centres.",
    },
    { type: "links", items: [{ label: "BOQ preparation services", href: landingRoutes.boq }] },
    { type: "h3", text: "BoQ revisions after design changes" },
    {
      type: "p",
      text: "When drawings change, we update the BoQ, highlight every change and provide a comparison report listing the items and pages that moved — everything needed to issue a tender addendum.",
    },
    { type: "h3", text: "Tender documents for GCC projects" },
    {
      type: "p",
      text: "Complete tender packages for GCC countries: invitation to tender, instructions to tenderers, form of tender, conditions of contract, specifications and supporting documents, together with the BoQ.",
    },
    { type: "h2", id: "by-role", text: "Services by client type" },
    {
      type: "table",
      head: ["Client", "Typical services", "Main benefit"],
      rows: [
        ["Property developers / clients", "Pre-contract QS review, take-offs, BoQ preparation, GCC tender documents, BoQ revisions, review of consultant BoQs", "Financial certainty and fewer surprises at tender"],
        ["Cost consultancy firms", "Take-offs, BoQ preparation and revisions", "Less pre-contract workload and lower overheads"],
        ["Contractors", "Take-offs, tender drawing checks, tender queries, subcontract BoQs, variations", "More accurate bids and better control of change"],
        ["Architects", "Take-offs, BoQ preparation, BoQ revisions, review of consultant BoQs", "Designs that stay within budget"],
      ],
    },
    {
      type: "links",
      items: [
        { label: "Property developers / clients", href: routes.developers },
        { label: "Cost consultancy firms", href: routes.consultants },
        { label: "Contractors", href: routes.contractors },
        { label: "Architects", href: routes.architects },
      ],
    },
    { type: "h2", id: "standards", text: "Standards and software" },
    {
      type: "p",
      text: "Consistency matters as much as accuracy. Our BoQs and take-offs follow internationally recognised methods of measurement — NRM 01, NRM 02, SMM 7, QSMM, POMI, CESMM 3, CESMM 4 and SLS 573 — and are produced with Revit, Bluebeam, AutoCAD and PlanSwift, so they fit straight into your workflow.",
    },
    { type: "h2", id: "team", text: "The team behind the work" },
    {
      type: "p",
      text: "Every quantity surveyor in our team holds a bachelor’s degree in quantity surveying, covering construction economics, cost management and contract administration, and continues to develop through ongoing professional training. Together the team has worked on projects across the Gulf region, the United Kingdom, Australia and New Zealand.",
    },
    { type: "h2", id: "uae", text: "Working with UAE projects" },
    {
      type: "p",
      text: "In the UAE, building BoQs are commonly measured to POMI or NRM 2, and many projects must also meet green building requirements — Al Sa’fat in Dubai and the Estidama Pearl Rating System in Abu Dhabi. We follow the standard your tender documents specify and keep sustainability-related items clearly described so tenderers price them correctly.",
    },
    { type: "links", items: [{ label: "Quantity surveying services in the UAE", href: landingRoutes.uae }] },
    { type: "h2", id: "start", text: "How to get started" },
    {
      type: "p",
      text: "Send us your drawings, specifications and the format you need. We confirm the scope, deliverables and delivery date, then measure, check and deliver. To discuss a project, book an online meeting or email info@qs-global-solutions.com.",
    },
  ],
};

export const posts: Post[] = [uaeGuide].sort((a, b) => b.published.localeCompare(a.published));
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

/** Reading time at ~220 words per minute. */
export function readingMinutes(p: Post) {
  const words = p.blocks
    .map((b) => (b.type === "p" || b.type === "h2" || b.type === "h3" ? b.text : b.type === "list" ? b.items.map((i) => `${i.title ?? ""} ${i.text}`).join(" ") : b.type === "table" ? b.rows.flat().join(" ") : ""))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
