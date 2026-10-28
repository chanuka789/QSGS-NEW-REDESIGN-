import { img } from "./media";
import { offices, routes } from "./site";

/**
 * Keyword landing pages: core services and the countries we serve. Each page has one
 * main search topic, original copy, an FAQ and links to related pages, so no two pages
 * compete for the same query. Country pages keep the URLs of the old website.
 */

export type LandingKind = "service" | "location" | "bank";

export type Landing = {
  key: string;
  kind: LandingKind;
  path: string;
  /** Breadcrumb / menu label. */
  label: string;
  /** One-line summary for menus and link lists. */
  summary: string;
  eyebrow: string;
  h1: string;
  lead: string;
  image: { src: string; alt: string };
  seo: { title: string; description: string; ogLabel: string };
  /** schema.org Service name and the places it covers. */
  serviceName: string;
  areaServed: string[];
  intro: { title: string; paragraphs: string[] };
  deliverables: { title: string; items: { title: string; text: string }[] };
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  contact?: { country: string; phone?: string; phoneHref?: string; email: string };
  faqs: { q: string; a: string }[];
  related: string[];
  /** Date the page content last changed (sitemap lastmod). */
  updated: string;
};

const office = (country: string) => {
  const o = offices.find((x) => x.country === country)!;
  return { country: o.country, phone: o.phone, phoneHref: o.phoneHref, email: o.email };
};

const pic = (file: string) => {
  const m = img(file);
  return { src: m.src, alt: m.alt };
};

export const landingRoutes = {
  boq: routes.boq,
  takeoff: routes.takeoff,
  costPlan: routes.costPlan,
  uae: routes.uae,
  qatar: routes.qatar,
  kuwait: routes.kuwait,
  saudi: routes.saudi,
  australia: routes.australia,
  bank: routes.bank,
  article: routes.article,
} as const;

/** How every engagement runs, shown on each landing page. */
export const processSteps = [
  { title: "Send your drawings", text: "Share PDF, DWG or Revit files with the specifications, and tell us the measurement standard and BoQ format you need." },
  { title: "Scope, timeline and quote", text: "We confirm exactly what is included, the deliverables and a delivery date before any work starts." },
  { title: "Measure and check", text: "Graduate quantity surveyors measure the work, then a second surveyor checks quantities and descriptions against the drawings." },
  { title: "Deliver and support", text: "You receive editable Excel and PDF files, take-off sheets and marked-up drawings, and we answer queries and revisions." },
] as const;

const GCC_STANDARDS = "POMI, NRM 2 or SMM7";

export const landings: Landing[] = [
  // ───────────────────────────── Core services ─────────────────────────────
  {
    key: "boq",
    kind: "service",
    path: landingRoutes.boq,
    label: "BOQ Preparation",
    summary: "Complete Bills of Quantities measured to NRM 2, POMI, SMM7 or CESMM4.",
    eyebrow: "BOQ preparation services",
    h1: "BOQ preparation services for construction projects",
    lead: "Complete, accurate Bills of Quantities prepared remotely by graduate quantity surveyors — measured to the standard you specify and delivered in your format.",
    image: pic("qsgs-commercial-06.webp"),
    seo: {
      title: "BOQ Preparation Services | Bills of Quantities | QSGS",
      description:
        "Remote BOQ preparation services for developers, consultants and contractors. Bills of Quantities measured to NRM 2, POMI, SMM7 or CESMM4, in Excel and PDF.",
      ogLabel: "BOQ Preparation Services",
    },
    serviceName: "Bill of Quantities (BOQ) preparation",
    areaServed: ["United Arab Emirates", "Qatar", "Saudi Arabia", "Kuwait", "Oman", "Australia", "United Kingdom", "Sri Lanka"],
    intro: {
      title: "A BoQ your whole team can rely on.",
      paragraphs: [
        "A Bill of Quantities (BoQ) turns drawings and specifications into a priced list of every item of work. It is the basis for tendering, comparing bids, valuing work and managing change — so errors in the BoQ become errors in the contract.",
        "We prepare complete BoQs from your drawings, specifications and BoQ format guidelines. Every quantity is traceable to a take-off sheet, and every description follows the standard method of measurement your project uses.",
      ],
    },
    deliverables: {
      title: "What you receive",
      items: [
        { title: "Complete Bills of Quantities", text: "Preliminaries, measured work and provisional sums, organised by trade or element to suit your project." },
        { title: "Your standard of measurement", text: "Measured to NRM 2, POMI, SMM7, QSMM, CESMM 3/4 or SLS 573 — whichever your contract specifies." },
        { title: "Every discipline", text: "Architectural, structural, M&E and plumbing, infrastructure, landscape, irrigation, ICT, security systems and data centres." },
        { title: "Your format", text: "Editable Excel and PDF, in our layout or your own template, ready to issue for tender." },
        { title: "Take-off sheets and marked-up drawings", text: "Supporting calculations so your team can check and update any quantity." },
        { title: "Quality assurance", text: "A second quantity surveyor checks quantities, descriptions and units before delivery." },
        { title: "Revisions after design changes", text: "Updated BoQs with changes highlighted and a comparison report of what moved." },
      ],
    },
    sections: [
      {
        title: "When you need a BoQ",
        paragraphs: [
          "Developers and consultants use BoQs to tender main contracts and compare bids on a like-for-like basis. Contractors use them to price tenders and to prepare subcontract packages. During construction, the same BoQ is used to value interim payments and variations.",
        ],
        bullets: [
          "Main contract tenders and re-tenders",
          "Subcontract and package BoQs for contractors",
          "Pre-tender estimates and budget checks",
          "BoQs for bank loans and project finance",
        ],
      },
      {
        title: "Standards we measure to",
        paragraphs: [
          "Across the GCC, BoQs are commonly measured to POMI or NRM 2, while civil engineering work often follows CESMM. In the UK, NRM 2 has replaced SMM7 for building works, and in Sri Lanka SLS 573 is widely used. We follow the standard named in your tender documents, or recommend one if it is open.",
        ],
      },
    ],
    faqs: [
      { q: "What do you need to prepare a BoQ?", a: "Drawings (PDF, DWG or Revit), the specifications and, if you have one, your BoQ template. Tell us the standard of measurement and the deadline, and we confirm scope and delivery date in our quote." },
      { q: "How long does BoQ preparation take?", a: "It depends on the size of the project and how complete the drawings are. We agree a delivery date before we start and can phase delivery by trade or by package if you need early sections." },
      { q: "Can you price the BoQ?", a: "Yes. We can add rates you provide, rates from recent tenders or market rates that we agree with you, so the BoQ becomes a pre-tender estimate." },
      { q: "Do you update the BoQ when the design changes?", a: "Yes. We revise the BoQ to the new drawings, highlight every change and provide a comparison report showing the items and pages that moved." },
    ],
    related: [landingRoutes.takeoff, landingRoutes.costPlan, routes.developers, routes.consultants],
    updated: "2026-10-28",
  },
  {
    key: "takeoff",
    kind: "service",
    path: landingRoutes.takeoff,
    label: "Quantity Take-Off",
    summary: "2D and 3D take-offs from PDF, DWG and Revit with full take-off sheets.",
    eyebrow: "Quantity take-off services",
    h1: "Quantity take-off services from 2D drawings and 3D models",
    lead: "Precise material quantities measured from PDF, AutoCAD and Revit files — with take-off sheets and marked-up drawings so every number can be checked.",
    image: pic("qsgs-infrastructure-03.webp"),
    seo: {
      title: "Quantity Take-Off Services | 2D & 3D Take-Offs | QSGS",
      description:
        "Accurate quantity take-off services from PDF, AutoCAD and Revit. Measured to NRM, POMI or SMM7 with take-off sheets and marked-up drawings. Delivered remotely.",
      ogLabel: "Quantity Take-Off Services",
    },
    serviceName: "Quantity take-off",
    areaServed: ["United Arab Emirates", "Qatar", "Saudi Arabia", "Kuwait", "Oman", "Australia", "United Kingdom", "Sri Lanka"],
    intro: {
      title: "Quantities you can trace back to the drawing.",
      paragraphs: [
        "A quantity take-off measures every element of a design — concrete, steel, blockwork, finishes, doors, services and external works — so that it can be estimated, priced or ordered. Good take-offs are fast to produce; great take-offs are also easy to check.",
        "Our quantity surveyors measure from 2D drawings and 3D models using Revit, Bluebeam, AutoCAD and PlanSwift. Each quantity is linked to a take-off sheet and, where helpful, a marked-up drawing, so your team can see exactly what was measured.",
      ],
    },
    deliverables: {
      title: "What you receive",
      items: [
        { title: "2D take-offs", text: "Measured from PDF and AutoCAD (DWG) drawings, including scanned sets." },
        { title: "3D model take-offs", text: "Quantities extracted from Revit models and checked against the drawings and specifications." },
        { title: "Take-off sheets", text: "Clear dimension and calculation sheets organised by trade, element or location." },
        { title: "Marked-up drawings", text: "Colour-coded mark-ups that show what was measured and where." },
        { title: "Standard methods", text: "Measured to NRM 01/02, SMM 7, QSMM, POMI, CESMM 3/4 or SLS 573 as required." },
        { title: "Every project type", text: "Commercial, residential, mixed-use, hotels, healthcare, education, industrial, expressways and infrastructure." },
      ],
    },
    sections: [
      {
        title: "Who uses our take-offs",
        paragraphs: [
          "Contractors use our take-offs to price tenders and order materials. Cost consultants use them to build BoQs and estimates without adding staff. Developers and architects use them to test design options against the budget early, when changes are cheap.",
        ],
        bullets: ["Tender pricing for contractors", "Estimates and BoQs for consultants", "Design-stage cost checks for architects", "Budget validation for developers"],
      },
      {
        title: "2D or 3D: which is better?",
        paragraphs: [
          "3D models make many quantities faster to extract, but models are rarely complete — finishes, openings and services are often modelled loosely. We use the model where it is reliable and measure from the drawings where it is not, then reconcile the two so the final quantities are complete.",
        ],
      },
    ],
    faqs: [
      { q: "Which file formats can you measure from?", a: "PDF drawings (including scanned sets), AutoCAD DWG files and Revit models. If you work with another format, send a sample and we will confirm." },
      { q: "Do you measure M&E services?", a: "Yes. We measure mechanical, electrical and plumbing works, as well as ICT, security systems and data centre installations." },
      { q: "Can you turn the take-off into a BoQ?", a: "Yes. Most clients ask for the take-off and the Bill of Quantities together, measured to the same standard. See our BOQ preparation service." },
      { q: "Do you visit the site?", a: "No. Our service is fully remote: we work from your drawings, models and specifications, which keeps costs and turnaround low." },
    ],
    related: [landingRoutes.boq, landingRoutes.costPlan, routes.contractors, routes.architects],
    updated: "2026-10-28",
  },
  {
    key: "costPlan",
    kind: "service",
    path: landingRoutes.costPlan,
    label: "Cost Plans & Estimates",
    summary: "Order-of-cost estimates and elemental cost plans that follow the design.",
    eyebrow: "Cost plan preparation",
    h1: "Cost plan and cost estimate preparation",
    lead: "Order-of-cost estimates and elemental cost plans that keep the design on budget — prepared remotely and updated as the design develops.",
    image: pic("qsgs-commercial-05.webp"),
    seo: {
      title: "Cost Plan Preparation & Cost Estimating Services | QSGS",
      description:
        "Cost plan preparation and construction cost estimating for developers and architects: order-of-cost estimates and elemental cost plans in line with NRM 1.",
      ogLabel: "Cost Plan Preparation",
    },
    serviceName: "Cost planning and cost estimating",
    areaServed: ["United Arab Emirates", "Qatar", "Saudi Arabia", "Kuwait", "Oman", "Australia", "United Kingdom", "Sri Lanka"],
    intro: {
      title: "Know the cost before you commit to the design.",
      paragraphs: [
        "Most budget problems start long before tender: a design grows, a specification changes, and nobody updates the numbers. A cost plan sets a budget for every element of the building and shows the effect of each design decision while it can still be changed.",
        "We prepare order-of-cost estimates at feasibility stage and elemental cost plans as the design develops, using the structure of NRM 1 — the RICS rules for order of cost estimating and cost planning. Each update shows what changed and why.",
      ],
    },
    deliverables: {
      title: "What you receive",
      items: [
        { title: "Order-of-cost estimates", text: "Early estimates from floor areas, functional units or outline drawings to test feasibility." },
        { title: "Elemental cost plans", text: "Budgets broken down by element — substructure, frame, envelope, finishes, services and external works." },
        { title: "Cost plan updates", text: "Revised cost plans at each design stage, with a clear reconciliation to the previous version." },
        { title: "Allowances made visible", text: "Preliminaries, overheads and profit, risk and inflation shown separately, never hidden in rates." },
        { title: "Option studies", text: "Side-by-side costs of design or specification options to support decisions." },
        { title: "Path to the BoQ", text: "When the design is ready, the cost plan becomes the check against which the tender BoQ is priced." },
      ],
    },
    sections: [
      {
        title: "How rates are set",
        paragraphs: [
          "A cost plan is only as good as its rates. We agree the pricing basis with you at the start: your own cost data, recent tender returns, or current market rates for the project location. Every assumption is written down, so the plan can be reviewed and challenged.",
        ],
      },
      {
        title: "Who it is for",
        paragraphs: [
          "Developers use cost plans to secure finance and control the brief. Architects use them to keep designs within budget. Cost consultants use our support to produce cost plans faster during busy periods.",
        ],
        bullets: ["Property developers and clients", "Architects and design teams", "Cost consultancy firms"],
      },
    ],
    faqs: [
      { q: "What is the difference between a cost estimate and a cost plan?", a: "An order-of-cost estimate gives an early total, usually from areas or functional units. A cost plan breaks the budget into elements and is updated as the design develops, so it can be used to control cost." },
      { q: "What do you need to prepare a cost plan?", a: "The latest drawings or sketches, an outline specification, the project location and the target budget if one exists. We confirm the pricing basis with you before starting." },
      { q: "Which standard do you follow?", a: "We structure cost plans in line with NRM 1, or with the format your organisation already uses." },
      { q: "Can you also prepare the tender BoQ?", a: "Yes. Once the design is complete we prepare the BoQ and check the priced result against the cost plan." },
    ],
    related: [landingRoutes.boq, landingRoutes.takeoff, routes.developers, routes.architects],
    updated: "2026-10-28",
  },

  // ───────────────────────────── Countries ─────────────────────────────
  {
    key: "uae",
    kind: "location",
    path: landingRoutes.uae,
    label: "UAE",
    summary: "Dubai, Abu Dhabi and the Northern Emirates, with a UAE contact.",
    eyebrow: "Quantity surveying in the UAE",
    h1: "Quantity surveying services in the UAE — Dubai and Abu Dhabi",
    lead: "Take-offs, BOQ preparation, cost plans and tender documents for developers, consultants and contractors across the Emirates — delivered remotely, with a UAE contact for your team.",
    image: pic("qsgs-residential-11.webp"),
    seo: {
      title: "Quantity Surveying Services UAE | Dubai & Abu Dhabi | QSGS",
      description:
        "Quantity surveying company serving Dubai, Abu Dhabi and the UAE: BOQ preparation, take-offs, cost plans and GCC tender documents. UAE: +971 54 554 7086.",
      ogLabel: "Quantity Surveying in the UAE",
    },
    serviceName: "Quantity surveying services in the UAE",
    areaServed: ["United Arab Emirates", "Dubai", "Abu Dhabi", "Sharjah"],
    intro: {
      title: "A quantity surveying partner for UAE projects.",
      paragraphs: [
        "The UAE construction market moves fast: tight tender periods, frequent design changes and projects that range from villas to high-rise towers and infrastructure. Our team supports UAE developers, cost consultants and contractors with the measurement-heavy work that has to be right and on time.",
        "We work remotely from your drawings and models, so you get experienced quantity surveyors without adding permanent staff. A UAE contact number and email keep communication simple, and our working day overlaps with yours.",
      ],
    },
    deliverables: {
      title: "Services for UAE projects",
      items: [
        { title: "BOQ preparation", text: `Bills of Quantities measured to ${GCC_STANDARDS}, in your format.` },
        { title: "Quantity take-offs", text: "2D and 3D take-offs for every discipline, with take-off sheets and mark-ups." },
        { title: "Cost plans and estimates", text: "Order-of-cost estimates and elemental cost plans for feasibility and design stages." },
        { title: "Tender documents", text: "Complete tender packages for GCC projects: ITT, instructions, form of tender, conditions, specifications and BoQ." },
        { title: "BoQ revisions and reviews", text: "Updated BoQs after design changes and independent reviews of consultant-prepared BoQs." },
        { title: "Contractor support", text: "Tender drawing checks, tender queries, subcontract BoQs and help preparing variations." },
      ],
    },
    sections: [
      {
        title: "Quantity surveying in Dubai",
        paragraphs: [
          "Dubai projects often combine high-rise residential, hospitality, retail and mixed-use space on one plot, with design changes continuing into tender. We prepare BoQs and take-offs that are easy to revise, and issue clear change reports with each revision, so tender addenda can be issued quickly.",
          "Where green building requirements such as Dubai Municipality’s Al Sa’fat system apply, we keep the related items clearly described in the BoQ so tenderers price them properly.",
        ],
      },
      {
        title: "Quantity surveying in Abu Dhabi",
        paragraphs: [
          "Abu Dhabi has a large share of government, master-developer and infrastructure work. New buildings must meet the Estidama Pearl Rating System, and many projects include roads, utilities and landscape packages measured under civil engineering methods such as CESMM.",
          "We measure building and civil works to the method each package requires and keep sustainability-related items itemised, so Abu Dhabi tenders are complete and comparable.",
        ],
      },
      {
        title: "Sharjah and the Northern Emirates",
        paragraphs: [
          "We also support residential, commercial and industrial projects in Sharjah, Ajman, Ras Al Khaimah, Umm Al Quwain and Fujairah — the same services, standards and quality checks.",
        ],
      },
    ],
    contact: office("UAE"),
    faqs: [
      { q: "Are you a quantity surveying company based in the UAE?", a: "We are a remote quantity surveying consultancy with a UAE contact (+971 54 554 7086, uae@qs-global-solutions.com). Our surveyors work from your drawings and models, which keeps costs lower than a full on-site team." },
      { q: "Which measurement standards are used in the UAE?", a: "Most UAE building BoQs are measured to POMI or NRM 2, and civil works often use CESMM. We follow whatever your tender documents specify." },
      { q: "Do you prepare tender documents for UAE projects?", a: "Yes. Our tender document service covers GCC projects, including the invitation to tender, instructions to tenderers, form of tender, conditions of contract, specifications and the BoQ." },
      { q: "Can you work in Dubai and Abu Dhabi at the same time?", a: "Yes. Location does not limit a remote team. We regularly run several packages in parallel and agree delivery dates for each." },
    ],
    related: [landingRoutes.article, landingRoutes.qatar, landingRoutes.saudi, landingRoutes.boq],
    updated: "2026-10-28",
  },
  {
    key: "qatar",
    kind: "location",
    path: landingRoutes.qatar,
    label: "Qatar",
    summary: "Doha and across Qatar: BoQs, take-offs and tender documents.",
    eyebrow: "Quantity surveying in Qatar",
    h1: "Quantity surveying services in Qatar",
    lead: "Remote take-offs, BOQ preparation, cost plans and tender documents for projects in Doha and across Qatar.",
    image: pic("qsgs-commercial-02.webp"),
    seo: {
      title: "Quantity Surveying Services in Qatar (Doha) | QSGS",
      description:
        "Quantity surveying services in Qatar: BOQ preparation, quantity take-offs, cost plans and GCC tender documents for developers, consultants and contractors in Doha.",
      ogLabel: "Quantity Surveying in Qatar",
    },
    serviceName: "Quantity surveying services in Qatar",
    areaServed: ["Qatar", "Doha"],
    intro: {
      title: "Quantities and BoQs for Qatar’s construction market.",
      paragraphs: [
        "Qatar’s building and infrastructure programme continues to create steady demand for accurate quantities and well-structured tender documents. Projects are typically specified to the Qatar Construction Specifications (QCS), and many require sustainability certification under GSAS.",
        "We help Qatar-based developers, consultants and contractors prepare take-offs and BoQs faster, without growing their in-house teams. You send drawings; we return checked quantities and documents in your format.",
      ],
    },
    deliverables: {
      title: "Services for Qatar projects",
      items: [
        { title: "BOQ preparation", text: `Bills of Quantities measured to ${GCC_STANDARDS} and aligned with the project specification.` },
        { title: "Quantity take-offs", text: "2D and 3D take-offs for building, MEP and infrastructure works." },
        { title: "Tender documents", text: "Complete GCC tender packages, from the invitation to tender to conditions of contract and BoQ." },
        { title: "Cost plans", text: "Order-of-cost estimates and elemental cost plans for feasibility and design." },
        { title: "Contractor tender support", text: "Quantity checks of tender drawings, tender queries and subcontract BoQs." },
        { title: "BoQ revisions", text: "Revised BoQs with highlighted changes and comparison reports for tender addenda." },
      ],
    },
    sections: [
      {
        title: "Working with Qatar specifications",
        paragraphs: [
          "Because QCS sets out both the technical requirements and, in places, the basis of measurement, BoQ descriptions need to match the specification sections closely. We cross-check our item descriptions against the specification so that tenderers price the right thing and queries are reduced.",
        ],
      },
      {
        title: "Infrastructure and public works",
        paragraphs: [
          "For roads, drainage and utilities packages — such as those procured by Ashghal, the Public Works Authority — we measure civil works to the method the tender requires and provide take-off sheets that make checking straightforward.",
        ],
      },
    ],
    faqs: [
      { q: "Do you have an office in Qatar?", a: "We serve Qatar remotely. Contact us at info@qs-global-solutions.com or through our UAE contact, and we will set up an online meeting at a time that suits you." },
      { q: "Can you prepare tender documents for Qatar projects?", a: "Yes. Our tender document preparation service is designed for GCC countries, including Qatar." },
      { q: "Which standard do you measure to in Qatar?", a: "We follow the method named in the tender documents — commonly POMI or NRM 2 for building works — and align descriptions with the QCS specification." },
      { q: "Do you support MEP and infrastructure works?", a: "Yes. We measure mechanical, electrical and plumbing works, ICT and security systems, and civil infrastructure." },
    ],
    related: [landingRoutes.uae, landingRoutes.saudi, landingRoutes.kuwait, landingRoutes.boq],
    updated: "2026-10-28",
  },
  {
    key: "kuwait",
    kind: "location",
    path: landingRoutes.kuwait,
    label: "Kuwait",
    summary: "A Kuwait contact for take-offs, BoQs and tender support.",
    eyebrow: "Quantity surveying in Kuwait",
    h1: "Quantity surveying services in Kuwait",
    lead: "Take-offs, BOQ preparation and tender support for Kuwait projects — with a local contact and a remote team of graduate quantity surveyors.",
    image: pic("qsgs-commercial-07.webp"),
    seo: {
      title: "Quantity Surveying Services in Kuwait | QSGS",
      description:
        "Quantity surveying services in Kuwait: BOQ preparation, quantity take-offs, cost plans and tender support for public and private projects. Kuwait: +965 9986 9738.",
      ogLabel: "Quantity Surveying in Kuwait",
    },
    serviceName: "Quantity surveying services in Kuwait",
    areaServed: ["Kuwait", "Kuwait City"],
    intro: {
      title: "Reliable quantities for Kuwait tenders.",
      paragraphs: [
        "Kuwait’s public projects are tendered through formal procurement processes, such as those run by the Central Agency for Public Tenders, where complete and consistent tender documents matter. Private developers and contractors face the same pressure: short tender periods and no room for missing items.",
        "We give Kuwait clients the measurement capacity to meet those deadlines. Our team prepares take-offs, BoQs and tender documents remotely, and our Kuwait contact makes it easy to start.",
      ],
    },
    deliverables: {
      title: "Services for Kuwait projects",
      items: [
        { title: "BOQ preparation", text: `Bills of Quantities measured to ${GCC_STANDARDS} in your tender format.` },
        { title: "Quantity take-offs", text: "Building, MEP and civil works measured from 2D drawings and 3D models." },
        { title: "Tender documents", text: "GCC tender packages with instructions, form of tender, conditions, specifications and BoQ." },
        { title: "Tender support for contractors", text: "Tender drawing checks, tender queries and subcontract BoQs." },
        { title: "Variations", text: "Measurement and documentation of scope changes during construction." },
        { title: "Cost plans", text: "Early estimates and elemental cost plans for developers." },
      ],
    },
    sections: [
      {
        title: "Built for formal tendering",
        paragraphs: [
          "In a formal tender, every bidder prices the same document, so ambiguities lead to queries, delays and disputes. We check drawings against specifications before measuring, raise clarifications early and keep BoQ descriptions consistent from item to item.",
        ],
      },
    ],
    contact: office("Kuwait"),
    faqs: [
      { q: "Do you have a contact in Kuwait?", a: "Yes. Call +965 9986 9738 or email kuwait@qs-global-solutions.com." },
      { q: "Do you work on public sector projects in Kuwait?", a: "We support consultants and contractors preparing documents and prices for public and private projects. We work from the tender documents you provide." },
      { q: "Can you help contractors during a tender?", a: "Yes. We verify quantities in tender drawings, prepare tender queries and produce subcontract BoQs so you can obtain prices quickly." },
    ],
    related: [landingRoutes.uae, landingRoutes.qatar, landingRoutes.saudi, routes.contractors],
    updated: "2026-10-28",
  },
  {
    key: "saudi",
    kind: "location",
    path: landingRoutes.saudi,
    label: "Saudi Arabia",
    summary: "Capacity for Saudi Arabia’s growing project pipeline.",
    eyebrow: "Quantity surveying in Saudi Arabia",
    h1: "Quantity surveying services in Saudi Arabia",
    lead: "Extra quantity surveying capacity for Saudi Arabia’s project pipeline: take-offs, BOQ preparation, cost plans and tender documents, delivered remotely.",
    image: pic("qsgs-mixed-use-01.webp"),
    seo: {
      title: "Quantity Surveying Services in Saudi Arabia | QSGS",
      description:
        "Quantity surveying services in Saudi Arabia for Riyadh, Jeddah and beyond: BOQ preparation, quantity take-offs, cost plans and GCC tender documents.",
      ogLabel: "Quantity Surveying in Saudi Arabia",
    },
    serviceName: "Quantity surveying services in Saudi Arabia",
    areaServed: ["Saudi Arabia", "Riyadh", "Jeddah", "Dammam"],
    intro: {
      title: "Scale your QS capacity with the Saudi market.",
      paragraphs: [
        "Saudi Vision 2030 has created one of the largest construction pipelines in the world, from giga-projects to housing, hospitality, healthcare and infrastructure. Many consultants and contractors simply do not have enough quantity surveyors for the volume of tenders.",
        "We add that capacity without the cost of new hires. Our graduate quantity surveyors prepare take-offs, BoQs and tender documents remotely, to your standards and formats, so your team can focus on commercial decisions.",
      ],
    },
    deliverables: {
      title: "Services for Saudi projects",
      items: [
        { title: "BOQ preparation", text: `Bills of Quantities measured to ${GCC_STANDARDS} and aligned with your specification.` },
        { title: "Quantity take-offs", text: "2D and 3D take-offs for building, MEP, landscape and infrastructure." },
        { title: "Tender documents", text: "Complete GCC tender packages including conditions of contract, specifications and BoQ." },
        { title: "Cost plans", text: "Order-of-cost estimates and elemental cost plans to test feasibility." },
        { title: "BoQ reviews", text: "Independent checks of consultant-prepared BoQs before tender." },
        { title: "Contractor support", text: "Quantity verification, tender queries, subcontract BoQs and variations." },
      ],
    },
    sections: [
      {
        title: "Large programmes, many packages",
        paragraphs: [
          "Large Saudi developments are usually tendered in many packages — enabling works, structure, MEP, façades, fit-out and landscape. We can take on whole packages or work alongside your team, using your templates so every package looks the same.",
          "Where projects follow the Saudi Building Code or client-specific standards, we align BoQ descriptions with the specification so tenderers price consistently.",
        ],
      },
    ],
    faqs: [
      { q: "Which cities in Saudi Arabia do you support?", a: "Our service is remote, so we support projects anywhere in the Kingdom, including Riyadh, Jeddah, Dammam and the giga-project regions." },
      { q: "Can you work inside our templates and systems?", a: "Yes. We prepare BoQs and take-offs in your format and to your measurement standard, so our work drops straight into your documents." },
      { q: "Do you prepare tender documents for Saudi projects?", a: "Yes. Our tender document service covers GCC countries, including Saudi Arabia." },
    ],
    related: [landingRoutes.uae, landingRoutes.qatar, landingRoutes.kuwait, landingRoutes.costPlan],
    updated: "2026-10-28",
  },
  {
    key: "australia",
    kind: "location",
    path: landingRoutes.australia,
    label: "Australia",
    summary: "Take-offs and BoQs for Australian builders and consultants.",
    eyebrow: "Quantity surveying in Australia",
    h1: "Quantity surveying services in Australia",
    lead: "Remote take-offs, estimating support and BoQs for Australian builders, quantity surveyors and developers — with an Australian contact number.",
    image: pic("qsgs-residential-04.webp"),
    seo: {
      title: "Quantity Surveying Services in Australia | QSGS",
      description:
        "Remote quantity surveying for Australian builders and consultants: quantity take-offs, estimating support, BoQs and cost plans. Australian contact: +61 415 854 225.",
      ogLabel: "Quantity Surveying in Australia",
    },
    serviceName: "Quantity surveying services in Australia",
    areaServed: ["Australia", "Sydney", "Melbourne", "Brisbane", "Perth"],
    intro: {
      title: "Estimating capacity for Australian teams.",
      paragraphs: [
        "Australian builders and quantity surveying practices face the same challenge: more tenders than estimators. Our team takes on the measurement work — take-offs, BoQs and estimate build-ups — so your estimators can concentrate on pricing and winning work.",
        "Our surveyors have experience on Australian and New Zealand projects, and we work to the measurement approach and templates you use. If your project uses the Australian Standard Method of Measurement or your own format, tell us at enquiry stage and we will confirm the approach in our quote.",
      ],
    },
    deliverables: {
      title: "Services for Australian projects",
      items: [
        { title: "Quantity take-offs", text: "Residential, commercial and civil take-offs from PDF, DWG and Revit." },
        { title: "Estimating support", text: "Measured quantities organised by trade, ready for your pricing." },
        { title: "Bills of Quantities", text: "Trade or elemental BoQs in your template." },
        { title: "Cost plans", text: "Early estimates and elemental cost plans for developers." },
        { title: "Variations", text: "Measurement of scope changes during construction." },
        { title: "Marked-up drawings", text: "Clear mark-ups so your team can check every quantity." },
      ],
    },
    sections: [
      {
        title: "Time zones that work for you",
        paragraphs: [
          "Our team works in time zones a few hours behind Australia’s east coast. Drawings sent during your day can be progressed during ours, which often means faster turnaround for tender deadlines.",
        ],
      },
    ],
    contact: office("Australia"),
    faqs: [
      { q: "Do you have an Australian contact?", a: "Yes. Call +61 415 854 225 or email au@qs-global-solutions.com." },
      { q: "Do you work for builders as well as consultants?", a: "Yes. We support builders and contractors with tender take-offs, and consultants and developers with BoQs and cost plans." },
      { q: "Which measurement standard do you use for Australian projects?", a: "We work to the standard and format your project requires. Tell us at enquiry stage and we confirm the approach before we start." },
    ],
    related: [landingRoutes.takeoff, landingRoutes.boq, landingRoutes.costPlan, routes.contractors],
    updated: "2026-10-28",
  },

  // ───────────────────────────── Sri Lanka: bank BoQs ─────────────────────────────
  {
    key: "bank",
    kind: "bank",
    path: landingRoutes.bank,
    label: "BOQ Certification for Bank Loans",
    summary: "BoQ preparation, estimates and certification for Sri Lankan bank loans.",
    eyebrow: "BOQ certification · Sri Lanka",
    h1: "BOQ preparation, estimation and certification for bank loans in Sri Lanka",
    lead: "Trusted BOQ certifications recognised by leading banks in Sri Lanka — for housing and commercial construction loans.",
    image: pic("qsgs-residential-05.webp"),
    seo: {
      title: "BOQ Certification for Bank Loans in Sri Lanka | QSGS",
      description:
        "BOQ preparation, cost estimates and BOQ certification for housing and commercial loans in Sri Lanka, trusted by local banks and financial institutions.",
      ogLabel: "BOQ Certification for Bank Loans",
    },
    serviceName: "BOQ certification for bank loans",
    areaServed: ["Sri Lanka", "Colombo"],
    intro: {
      title: "BoQ documents your bank will accept.",
      paragraphs: [
        "Banks in Sri Lanka usually ask for a Bill of Quantities and a cost estimate, certified by a qualified quantity surveyor, before approving a housing or commercial construction loan. The documents show the bank what will be built and what it will cost, and they are used again when loan instalments are released.",
        "Quantity Surveying Global Solutions prepares, estimates and certifies BoQs that meet bank requirements. Our certifications are known for their accuracy and are trusted by local banks and financial institutions across Sri Lanka, which helps your loan move through approval smoothly.",
      ],
    },
    deliverables: {
      title: "What we provide",
      items: [
        { title: "BoQ preparation", text: "A complete Bill of Quantities prepared from your approved drawings, in the format your bank requires." },
        { title: "Cost estimate", text: "A realistic estimate of the construction cost at current market rates." },
        { title: "BoQ certification", text: "Certification of the BoQ and estimate by a qualified quantity surveyor for submission to your bank." },
        { title: "Housing and commercial loans", text: "Documents for new houses, extensions, apartments and commercial buildings." },
      ],
    },
    sections: [
      {
        title: "How it works",
        paragraphs: [
          "Send us your approved drawings and any specification or bank checklist you have received. We prepare the BoQ and estimate, review them with you, and issue the certified documents ready for submission to the bank.",
        ],
      },
    ],
    contact: office("Sri Lanka"),
    faqs: [
      { q: "Which loans are BOQ certifications used for?", a: "Housing loans and commercial construction loans, where the bank needs a certified BoQ and cost estimate before approval." },
      { q: "What do I need to send?", a: "Your approved building drawings, any specifications, and the bank’s checklist or format if they have given you one." },
      { q: "How do I contact you in Sri Lanka?", a: "Email sl@qs-global-solutions.com or info@qs-global-solutions.com, or book an online meeting through our contact page." },
    ],
    related: [landingRoutes.boq, landingRoutes.costPlan, routes.developers],
    updated: "2026-10-28",
  },
];

export const landingByKey = (key: string) => landings.find((l) => l.key === key)!;
export const landingByPath = (path: string) => landings.find((l) => l.path === path);
export const serviceLandings = landings.filter((l) => l.kind === "service");
export const locationLandings = landings.filter((l) => l.kind === "location");
