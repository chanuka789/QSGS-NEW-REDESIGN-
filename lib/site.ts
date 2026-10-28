export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://qs-global-solutions.com").replace(/\/$/, "");

export const company = {
  name: "Quantity Surveying Global Solutions",
  shortName: "QSGS",
  legalName: "Quantity Surveying Global Solutions",
  tagline: "Expert Taking-Off & BOQ Services",
  email: "info@qs-global-solutions.com",
  description:
    "Your trusted partner for comprehensive quantity surveying services, including precise cost estimation, 2D and 3D take-off services, and detailed BOQ preparation.",
  foundingRegion: "Gulf region, United Kingdom, Australia and New Zealand",
} as const;

export type Office = {
  country: string;
  code: string;
  phone?: string;
  phoneHref?: string;
  email: string;
  lat: number;
  lng: number;
  timezone: string;
};

export const offices: Office[] = [
  { country: "UAE", code: "AE", phone: "+971 54 554 7086", phoneHref: "tel:+971545547086", email: "uae@qs-global-solutions.com", lat: 25.2, lng: 55.27, timezone: "Asia/Dubai" },
  { country: "Kuwait", code: "KW", phone: "+965 9986 9738", phoneHref: "tel:+96599869738", email: "kuwait@qs-global-solutions.com", lat: 29.37, lng: 47.98, timezone: "Asia/Kuwait" },
  { country: "Australia", code: "AU", phone: "+61 415 854 225", phoneHref: "tel:+61415854225", email: "au@qs-global-solutions.com", lat: -33.87, lng: 151.21, timezone: "Australia/Sydney" },
  { country: "Sri Lanka", code: "LK", email: "sl@qs-global-solutions.com", lat: 6.93, lng: 79.86, timezone: "Asia/Colombo" },
];

/** Markets named on the current website ("20+ Countries" section). */
export const markets = [
  { name: "Australia", lat: -33.87, lng: 151.21 },
  { name: "New Zealand", lat: -36.85, lng: 174.76 },
  { name: "United Kingdom", lat: 51.5, lng: -0.12 },
  { name: "USA", lat: 40.71, lng: -74.0 },
  { name: "Canada", lat: 43.65, lng: -79.38 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Europe", lat: 48.85, lng: 2.35 },
  { name: "UAE", lat: 25.2, lng: 55.27 },
  { name: "Middle East", lat: 24.71, lng: 46.68 },
] as const;

export const routes = {
  home: "/",
  about: "/about-us/",
  services: "/our-services/",
  consultants: "/our-quantity-surveying-remote-services-for-consultant-firms-qs-qlobal-solutions/",
  developers: "/quantity-surveying-services-for-property-developers-clients/",
  contractors: "/our-services-for-contractors/",
  architects: "/quantity-surveying-remote-services-for-independant-architects/",
  careers: "/careers/",
  team: "/highly-qualified-quantity-surveyors-leading-qs-outsource-company/",
  contact: "/contact-us-quantity-surveying-global-solutions/",
  privacy: "/privacy-policy/",
  // Core service pages
  boq: "/boq-preparation-services/",
  takeoff: "/quantity-take-off-services/",
  costPlan: "/cost-plan-preparation-services/",
  // Country pages (URLs kept from the old website)
  uae: "/our-services-uae/",
  qatar: "/quantity-surveying-services-in-qatar-quantity-surveying-global-solutions/",
  kuwait: "/quantity-surveying-services-in-kuwait-quantity-surveying-global-solutions/",
  saudi: "/leading-quantity-surveying-services-in-saudi-arabia-quantity-surveying-global-solutions/",
  australia: "/expert-quantity-surveying-services-in-australia-quantity-surveying-global-solutions/",
  bank: "/trusted-boq-certification-services-recognized-by-sri-lankan-banks/",
  article: "/expert-remote-quantity-surveying-services-in-uae-qs-global-solutions/",
  insights: "/insights/",
} as const;

/** Contact form opened on "Request a quotation". */
export const quoteHref = `${routes.contact}?type=quote#form`;

export type NavItem = { label: string; href: string; description?: string; children?: NavItem[] };

export const mainNav: NavItem[] = [
  { label: "Home", href: routes.home },
  {
    label: "About",
    href: routes.about,
    children: [
      { label: "About us", href: routes.about, description: "Our story, mission and the way we work." },
      { label: "Our Team", href: routes.team, description: "Highly qualified quantity surveyors." },
      { label: "Insights", href: routes.insights, description: "Guides on quantity surveying and BOQs." },
    ],
  },
  {
    label: "Services",
    href: routes.services,
    children: [
      { label: "Cost Consultant Firms", href: routes.consultants, description: "Reduce pre-contract workload with savings." },
      { label: "Property Developers / Clients", href: routes.developers, description: "Expert pre-contract QS support." },
      { label: "Contractors", href: routes.contractors, description: "Streamlined tendering and variations." },
      { label: "Architects Firms", href: routes.architects, description: "Accurate QS for visionary projects." },
      { label: "BOQ Preparation", href: routes.boq, description: "Bills of Quantities to NRM, POMI or SMM7." },
      { label: "Quantity Take-Off", href: routes.takeoff, description: "2D and 3D take-offs with full mark-ups." },
      { label: "Cost Plans & Estimates", href: routes.costPlan, description: "Budgets that follow the design." },
      { label: "BOQ Certification (Sri Lanka)", href: routes.bank, description: "Certified BoQs for bank loans." },
    ],
  },
  {
    label: "Locations",
    href: routes.uae,
    children: [
      { label: "UAE — Dubai & Abu Dhabi", href: routes.uae, description: "Quantity surveying across the Emirates." },
      { label: "Qatar", href: routes.qatar, description: "BoQs and tender documents in Doha." },
      { label: "Saudi Arabia", href: routes.saudi, description: "Capacity for the Saudi pipeline." },
      { label: "Kuwait", href: routes.kuwait, description: "Tender support with a Kuwait contact." },
      { label: "Australia", href: routes.australia, description: "Take-offs for builders and consultants." },
      { label: "Guide: remote QS in the UAE", href: routes.article, description: "How remote quantity surveying works." },
    ],
  },
  { label: "Careers", href: routes.careers },
  { label: "Contact", href: routes.contact },
];

export const projectTypes = [
  "Commercial",
  "Residential",
  "Mixed-Use",
  "Hotels",
  "Healthcare",
  "Educational",
  "Sports",
  "Recreational",
  "Industrial",
  "Irrigation",
  "Expressways",
  "Infrastructure",
] as const;

export const disciplines = [
  { name: "Architectural", icon: "Building2" },
  { name: "Structural", icon: "Layers" },
  { name: "Mechanical, Electrical (M&E) & Plumbing", icon: "Cable" },
  { name: "Infrastructural", icon: "Route" },
  { name: "Landscape", icon: "Trees" },
  { name: "Irrigation", icon: "Droplets" },
  { name: "ICT & Security Systems", icon: "ShieldCheck" },
  { name: "Data Centers", icon: "Server" },
] as const;

export const standards = ["NRM 01", "NRM 02", "SMM 7", "QSMM", "POMI", "CESMM 3", "CESMM 4", "SLS 573"] as const;
export const software = ["Revit", "Bluebeam", "AutoCAD", "PlanSwift", "Excel", "PDF"] as const;

export const companyTypes = [
  "Property Developer / Client",
  "Cost Consultant Firm",
  "Contracting Firm",
  "Architect Firm",
  "Engineering Firm",
  "Other",
] as const;

/**
 * Countries we work in (highlighted on the globe). Sri Lanka is the hub every
 * arc connects to. `anchor` is the label/arc point; `label` is the leader-line
 * offset in px so the close Gulf labels never overlap.
 */
export type WorkingCountry = { code: string; name: string; lat: number; lng: number; label: [number, number]; hub?: boolean };
export const workingCountries: WorkingCountry[] = [
  { code: "LK", name: "Sri Lanka", lat: 7.85, lng: 80.7, label: [54, 22], hub: true },
  { code: "AE", name: "UAE", lat: 24.2, lng: 54.4, label: [40, -46] },
  { code: "QA", name: "Qatar", lat: 25.3, lng: 51.2, label: [-4, 60] },
  { code: "KW", name: "Kuwait", lat: 29.3, lng: 47.6, label: [-40, -44] },
  { code: "OM", name: "Oman", lat: 21.0, lng: 57.0, label: [52, 40] },
  { code: "SA", name: "Saudi Arabia", lat: 24.0, lng: 45.0, label: [-58, 30] },
  { code: "GB", name: "United Kingdom", lat: 53.5, lng: -1.5, label: [0, -40] },
  { code: "AU", name: "Australia", lat: -22.5, lng: 122.5, label: [-36, 40] },
];
