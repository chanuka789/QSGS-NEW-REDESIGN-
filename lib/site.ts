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
} as const;

export type NavItem = { label: string; href: string; description?: string; children?: NavItem[] };

export const mainNav: NavItem[] = [
  { label: "Home", href: routes.home },
  {
    label: "About",
    href: routes.about,
    children: [
      { label: "About us", href: routes.about, description: "Our story, mission and the way we work." },
      { label: "Our Team", href: routes.team, description: "Highly qualified quantity surveyors." },
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
