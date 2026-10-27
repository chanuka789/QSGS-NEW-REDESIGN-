import { routes } from "./site";

export type ServiceItem = { title: string; text: string };
export type ServiceModule = {
  id: string;
  title: string;
  short: string;
  intro: string;
  icon: string;
  image: string;
  imageAlt: string;
  items: ServiceItem[];
};

const PROJECT_TYPES_TEXT =
  "Commercial, Residential, Mixed-Use, Hotels, Healthcare, Educational, Sports, Recreational, Industrial, Irrigation, Expressways, and Infrastructure Projects";
const DIVISIONS_TEXT =
  "architectural, structural, mechanical & electrical (M&E), infrastructural, landscape, irrigation, ICT and security systems and data centers, ensuring comprehensive coverage";
const STANDARDS_TEXT = "NRM 01, NRM 02, SMM 7, QSMM, POMI, CESMM 3, CESMM 4, SLS 573";

const remote = (what: string): ServiceItem => ({
  title: "Remote Service Delivery",
  text: `We can deliver our ${what} services remotely, leveraging digital tools and communication technologies to provide precise and reliable documents to clients worldwide.`,
});

export const modules: Record<string, ServiceModule> = {
  takeoff: {
    id: "take-off-quantities",
    title: "Take-off Quantities",
    short: "Take-off quantities",
    icon: "Ruler",
    image: "/images/work/takeoff-3d-model.webp",
    imageAlt: "3D model quantity take-off in progress",
    intro:
      "We provide precise take-off quantities for your construction projects, including 2D drawings and 3D models, ensuring accurate quantification of elements. This supports effective cost estimation and project planning.",
    items: [
      { title: "Take-off Sheets for Wide Range of Project Types", text: `We offer specialized Take-Off Remote Services for various project types, including ${PROJECT_TYPES_TEXT}.` },
      { title: "Expertise Across Various Divisions", text: `We have the expertise to prepare BoQs for diverse project types, including ${DIVISIONS_TEXT}.` },
      { title: "Adherence to Standard Methods", text: `We follow standardized methods of measurements, such as ${STANDARDS_TEXT} to ensure consistency and reliability in our quantification processes.` },
      { title: "Ability to Measure Various Drawing Formats", text: "We have the ability to use various drawings formats, including 2D and 3D models, AutoCAD, and PDF formats, to ensure precise and detailed measurements and analysis for your construction projects." },
      { title: "Advanced Software for Quantification", text: "Our team employs industry-leading software such as Revit, Bluebeam, AutoCAD, and PlanSwift for accurate quantification of materials, enhancing the precision of our quantification." },
      { title: "Provision of Detailed Documents", text: "We provide comprehensive take-off sheets and essential documents, ensuring transparency and accuracy. Additionally, we offer marked-up drawings when necessary to highlight specific details and modifications as per client requirements." },
      remote("Quantity take-off"),
    ],
  },
  boq: {
    id: "preparation-of-bills-of-quantities",
    title: "Preparation of Bills of Quantities",
    short: "Preparation of bills of quantities",
    icon: "FileSpreadsheet",
    image: "/images/work/boq-sheet.webp",
    imageAlt: "Bill of Quantities spreadsheet prepared by QSGS",
    intro:
      "Our team prepares complete Bills of Quantities (BoQs) with precise quantities, adhering to the drawings, specifications, and the standard method of measurements — based on the client’s requirements and format guidelines.",
    items: [
      { title: "Comprehensive BoQ Preparation for Wide Range of Project Types", text: `We offer specialized Take-Off and BoQ Preparation Remote Services for various project types, including ${PROJECT_TYPES_TEXT}.` },
      { title: "Expertise Across Various Divisions", text: `We have the expertise to prepare BoQs for diverse project types, including ${DIVISIONS_TEXT}.` },
      { title: "Detailed Quantification", text: "We have the ability to prepare complete Bills of Quantities (BoQs) with precise quantification of materials, labor, and equipment, ensuring all project elements are thoroughly accounted for according to the drawings and specifications." },
      { title: "Adherence to Standards", text: `Our team can strictly follow the standard methods of measurement, such as ${STANDARDS_TEXT}, ensuring consistency and compliance with industry standards in our BoQ preparation.` },
      { title: "Comprehensive Documentation", text: "We provide the capability to produce detailed and organized BoQ documents, breaking down each element of the project into quantifiable units, facilitating efficient project planning and execution." },
      { title: "Customized Formats", text: "We can offer BoQs in various formats to suit client requirements such as Excel & PDF, ensuring ease of use and accessibility." },
      { title: "Coordination with Project Specifications", text: "Our team ensures meticulous alignment of BoQ preparation with project specifications and drawings, providing accuracy and relevance to the specific project needs." },
      { title: "Quality Assurance", text: "We have the ability to conduct rigorous quality checks on our BoQ preparation to ensure all details are accurate and complete, providing a reliable foundation for project execution." },
      remote("BoQ preparation"),
    ],
  },
  tenderDocs: {
    id: "tender-documents-preparation",
    title: "Tender Documents Preparation",
    short: "Tender documents preparation",
    icon: "FileStack",
    image: "/images/work/boq-cover.webp",
    imageAlt: "Tender document and BoQ cover prepared for a GCC project",
    intro:
      "We provide comprehensive tender document preparation services exclusively for GCC countries. Our offerings include detailed project specifications, terms of contract, schedules, and precise drawings, accompanied by a bill of quantities and clear legal terms. This service is crucial for ensuring accurate project scope definition and facilitating competitive bidding, leading to streamlined project execution across the Gulf region.",
    items: [
      { title: "Notice Inviting Tender (NIT) or Invitation to Tender (ITT)", text: "This document announces the tender and provides basic information about the project, including the scope of work, tender submission deadline, and contact details." },
      { title: "Instructions to Tenderers", text: "This section details the procedure for submitting the tender, including any specific requirements like bond payments, the format of the submission, and the criteria for evaluation." },
      { title: "Form of Tender", text: "A standard form that tenderers are required to fill out and submit. It typically includes the tenderer’s acknowledgment of the terms and conditions, their bid price, and commitments." },
      { title: "Conditions of Contract", text: "This outlines the legal terms and conditions under which the work will be carried out, including payment terms, dispute resolution mechanisms, and termination clauses." },
      { title: "Specifications", text: "Detailed description of the project, including technical specifications, quality standards expected, and materials to be used." },
      { title: "Other Supplementary Documents", text: "May include site surveys, geotechnical reports, environmental impact assessments, and other relevant studies or reports." },
    ],
  },
  revision: {
    id: "boq-revision-services",
    title: "BoQ Revision Services Aligned with Design Changes",
    short: "BoQ revision services aligned with design changes",
    icon: "GitCompareArrows",
    image: "/images/work/boq-concrete.webp",
    imageAlt: "Revised Bill of Quantities with highlighted changes",
    intro:
      "Our BoQ Revision Services meticulously update your Bills of Quantities to reflect the latest design changes, ensuring accuracy and alignment with current project specifications.",
    items: [
      { title: "BoQ Revision for Wide Range of Project Types", text: `We offer BoQ revisions for various project types, including ${PROJECT_TYPES_TEXT}.` },
      { title: "Expertise Across Various Divisions", text: `We have the expertise to review BoQs for diverse project types, including ${DIVISIONS_TEXT}.` },
      { title: "Updated BoQ with Highlighted Changes", text: "We provide the BoQ to align with the revised drawings and specifications. Our team provides a highlighted version of the BoQ to clearly showcase all changes and adjustments." },
      { title: "Comparison Report on BoQ Updates", text: "We deliver comprehensive reports detailing the differences between the previous and updated BoQs, including specific pages and items that have been modified." },
      { title: "Documentation Support for Tender Addendums", text: "We supply all necessary documentation to issue tender addendums in response to design changes and revisions." },
      remote("BoQ revision"),
    ],
  },
  review: {
    id: "review-of-consultant-prepared-boq",
    title: "Review of Consultant-Prepared BoQ",
    short: "Review of consultant-prepared BoQ",
    icon: "SearchCheck",
    image: "/images/work/boq-summary.webp",
    imageAlt: "BoQ summary under professional review",
    intro:
      "We offer professional reviews of BoQs prepared by consultants, ensuring accuracy, adherence to project specifications, drawings and compliance with industry standards. Our detailed assessments help identify discrepancies and improve overall project reliability and efficiency.",
    items: [
      { title: "BoQ Review for Wide Range of Project Types", text: `We offer BoQ review for various project types, including ${PROJECT_TYPES_TEXT}.` },
      { title: "Expertise Across Various Divisions", text: `We have the expertise to review BoQs for diverse project types, including ${DIVISIONS_TEXT}.` },
      { title: "BoQ Review Summary Reports", text: "We deliver comprehensive BoQ Review Summary Reports, providing detailed insights and actionable recommendations." },
      remote("BoQ review"),
    ],
  },
  verification: {
    id: "quantity-verification-for-tender-drawings",
    title: "Comprehensive Quantity Verification for Tender Drawings",
    short: "Comprehensive quantity verification for tender drawings",
    icon: "ScanSearch",
    image: "/images/work/takeoff-2d-plan.webp",
    imageAlt: "Tender drawing quantity verification",
    intro:
      "Our team thoroughly checks tender drawings for accurate quantity assessments, ensuring reliable information for cost estimation and project planning, all while adhering to industry standards.",
    items: [
      { title: "Comprehensive Review of Specifications", text: "Our team thoroughly examines all project specifications, dimensions, and quantities, ensuring they align with the provided tender drawings." },
      { title: "Identification of Discrepancies", text: "We identify and address any discrepancies or potential issues early in the process, preventing costly errors and ensuring accuracy." },
    ],
  },
  tenderQueries: {
    id: "preparation-of-tender-queries",
    title: "Preparation of Tender Queries",
    short: "Preparation of tender queries",
    icon: "MessageSquareText",
    image: "/images/work/takeoff-markup.webp",
    imageAlt: "Marked-up drawings used to prepare tender queries",
    intro:
      "Our team carefully examines tender documents to identify ambiguities, inconsistencies, or missing information. We then prepare detailed queries to submit to consultants, seeking clarification and additional details. This ensures a comprehensive understanding of project requirements and helps prevent misunderstandings during the tendering process before finalizing.",
    items: [
      { title: "Thorough Document Review", text: "Our team thoroughly examines all project specifications, dimensions, and quantities, ensuring they align with the provided tender drawings." },
      { title: "Precise Query Formulation", text: "Our team crafts detailed and specific queries to address ambiguities and seek clarification." },
      { title: "Ensuring Comprehensive Understanding", text: "By clarifying uncertainties, we ensure a complete and accurate understanding of the project scope and requirements." },
      { title: "Timely Communication", text: "We promptly submit queries to consultants, allowing sufficient time for responses and minimizing delays." },
      { title: "Enhancing Tender Accuracy", text: "Our process helps to refine and clarify tender submissions, ensuring they are accurate and comprehensive, thus reducing the potential for errors or misunderstandings." },
    ],
  },
  variations: {
    id: "assistance-in-preparing-variations",
    title: "Assistance in Preparing Variations",
    short: "Assistance in preparing variations",
    icon: "Scale",
    image: "/images/work/takeoff-3d-tower.webp",
    imageAlt: "3D tower model used to quantify variations",
    intro:
      "Our team provides expert support in preparing variations, ensuring that all changes to the project scope are accurately documented and quantified. We work to identify, evaluate, and document modifications, ensuring compliance with contractual requirements. This process helps manage project costs and timelines, while maintaining transparency and clarity.",
    items: [
      { title: "Accurate Documentation", text: "We ensure all changes to the project scope are meticulously documented, capturing every detail and modification." },
      { title: "Precise Quantification", text: "Our team carefully measures and quantifies the impact of variations, providing clear and accurate information for cost management." },
      { title: "Cost and Timeline Management", text: "By managing variations effectively, we help to control project costs and timelines, ensuring smooth project progression." },
    ],
  },
};

const contractorBoq: ServiceModule = {
  ...modules.boq,
  intro:
    "Our team prepares comprehensive Bills of Quantities (BoQs) with precise quantities, strictly following the drawings, specifications, and standard methods of measurement. We tailor the BoQs to meet the client’s specific requirements and format guidelines. Additionally, we prepare these BoQs for submission to subcontractors, ensuring clear and accurate communication of project scope and expectations.",
};

export type Segment = {
  key: "developers" | "consultants" | "contractors" | "architects";
  href: string;
  label: string;
  cardTitle: string;
  cardText: string;
  icon: string;
  eyebrow: string;
  h1: string;
  lead: string;
  heroImage: string;
  gallery: { src: string; alt: string }[];
  modules: ServiceModule[];
  seo: { title: string; description: string; ogTitle: string; ogDescription?: string };
};

const developerGallery = [
  { src: "/images/projects/hotel-tower.webp", alt: "Quantity Surveying Services For Property Developers - hotel tower" },
  { src: "/images/projects/hillside-housing.webp", alt: "Quantity Surveying Services For Property Developers - hillside housing" },
  { src: "/images/projects/wave-residences.webp", alt: "Quantity Surveying Services For Property Developers - residences" },
  { src: "/images/projects/office-tower.webp", alt: "Quantity Surveying Services For Property Developers - office tower" },
  { src: "/images/projects/corporate-hq.webp", alt: "Quantity Surveying Services For Property Developers - corporate headquarters" },
];

export const segments: Segment[] = [
  {
    key: "developers",
    href: routes.developers,
    label: "Property Developers / Clients",
    cardTitle: "For Property Developers / Clients",
    cardText: "We provide expert support in reviewing quantity surveying aspects on the pre-contract side.",
    icon: "Building",
    eyebrow: "Remote services for Property Developers / Clients",
    h1: "Our services for Property Developers / Clients",
    lead: "Expert, remote quantity surveying support on the pre-contract side — from take-offs and BoQs to complete tender documents and independent reviews of consultant-prepared BoQs.",
    heroImage: "/images/projects/hotel-tower.webp",
    gallery: developerGallery,
    modules: [modules.takeoff, modules.boq, modules.tenderDocs, modules.revision, modules.review],
    seo: {
      title: "Quantity Surveying Services For Property Developers / Clients | QSGS",
      ogTitle: "Remote services for Property Developers / Clients | Quantity Surveying Global Solutions",
      description:
        "Comprehensive Quantity Surveying Services for Property Developers and Clients: Specializing in 2D and 3D take-off services, BOQ preparation for Architectural, Structural, M&E, Plumbing, Infrastructural, Landscape, Irrigation, ICT, and Security Systems & Data Centers. Ensure precision and efficiency in your projects with our expert services.",
    },
  },
  {
    key: "consultants",
    href: routes.consultants,
    label: "Cost Consultant Firms",
    cardTitle: "For Consultant Firms",
    cardText: "We assist consultants in reducing pre-contract workload while maximizing benefits with savings.",
    icon: "Handshake",
    eyebrow: "Remote Services For Cost Consultant Firms",
    h1: "Our Quantity Surveying Remote Services for Cost Consultant Firms",
    lead: "An extension of your QS team. We take on the measurement-heavy pre-contract work so your consultants can focus on advice — while you save on overheads.",
    heroImage: "/images/projects/residential-courtyard.webp",
    gallery: [
      { src: "/images/projects/residential-courtyard.webp", alt: "Our Quantity Surveying Remote Services for Consultant Firms - residential" },
      { src: "/images/projects/residential-corner.webp", alt: "Our Quantity Surveying Remote Services for Consultant Firms - corner block" },
      { src: "/images/projects/commercial-tower.webp", alt: "Our Quantity Surveying Remote Services for Consultant Firms - commercial tower" },
      { src: "/images/projects/mixed-use-night.webp", alt: "Our Quantity Surveying Remote Services for Consultant Firms - mixed use" },
    ],
    modules: [modules.takeoff, modules.boq, modules.revision],
    seo: {
      title: "Our Quantity Surveying Remote Services for Consultant Firms | QSGS",
      ogTitle: "Remote Services For Cost Consultant Firms | Quantity Surveying Global Solutions",
      description:
        "QS Global Solutions | Your trusted partner for comprehensive quantity surveying remote services worldwide. Specializing in take-off services and BOQ preparation for diverse projects.",
    },
  },
  {
    key: "contractors",
    href: routes.contractors,
    label: "Contractors",
    cardTitle: "For Contracting Firms",
    cardText: "We help contracting firms streamline their processes and enhance efficiency with precise quantity surveying services.",
    icon: "HardHat",
    eyebrow: "Remote services for Contractors",
    h1: "Our Quantity Surveying Remote Services for Contractors",
    lead: "Win tenders with confidence. We verify quantities, raise the right tender queries, prepare subcontract BoQs and support you with variations after award.",
    heroImage: "/images/projects/high-rise-plaza.webp",
    gallery: developerGallery,
    modules: [modules.takeoff, modules.verification, modules.tenderQueries, contractorBoq, modules.variations],
    seo: {
      title: "Our services for Contractors | Quantity Surveying Global Solutions",
      ogTitle: "Remote services for Contractors | Quantity Surveying Global Solutions",
      description:
        "We offer specialized services for contractors, including quantity surveying, BoQ preparation, and take-off measurements. Our team assists with tender queries, variation management, and compliance, providing efficient solutions for streamlined project planning and execution.",
    },
  },
  {
    key: "architects",
    href: routes.architects,
    label: "Architects Firms",
    cardTitle: "For Architects Firms",
    cardText: "Inspiring independent architects with accurate quantity surveying for visionary project success.",
    icon: "PencilRuler",
    eyebrow: "Remote Services For Architects Firms",
    h1: "Our Quantity Surveying Remote Services for Architects Firms",
    lead: "Bring cost certainty to your designs. Accurate take-offs and BoQs that keep pace with every design revision — delivered remotely by graduate quantity surveyors.",
    heroImage: "/images/projects/cultural-pavilion.webp",
    gallery: [
      { src: "/images/projects/cultural-pavilion.webp", alt: "Quantity Surveying Remote Services For Independent Architects - pavilion" },
      { src: "/images/projects/residential-street.webp", alt: "Quantity Surveying Remote Services For Independent Architects - residential street" },
      { src: "/images/projects/residential-block.webp", alt: "Quantity Surveying Remote Services For Independent Architects - residential block" },
      { src: "/images/projects/high-rise-plaza.webp", alt: "Quantity Surveying Remote Services For Independent Architects - high rise" },
      { src: "/images/projects/civic-building.webp", alt: "Quantity Surveying Remote Services For Independent Architects - civic building" },
    ],
    modules: [modules.takeoff, modules.boq, modules.revision, modules.review],
    seo: {
      title: "Quantity Surveying Remote Services For Independent Architects | QSGS",
      ogTitle: "Remote Services For Architects Firms | Quantity Surveying Global Solutions",
      description:
        "Remote Quantity Surveying Services for Independent Architects: Expert 2D and 3D take-off services, BOQ preparation, and comprehensive cost management for architectural projects. Enhance your project’s accuracy and efficiency with our specialized remote services.",
    },
  },
];

export const segmentByKey = (key: Segment["key"]) => segments.find((s) => s.key === key)!;

/** Order used on the home page (matches the current website). */
export const homeSegmentOrder: Segment["key"][] = ["developers", "consultants", "contractors", "architects"];

export const benefits = [
  { title: "Expertise and Experience", icon: "Award", text: "Graduate quantity surveyors with hands-on experience across the Gulf region, the UK, Australia and New Zealand." },
  { title: "Cost Savings", icon: "PiggyBank", text: "Reduce pre-contract overheads. Pay for the output you need — without the cost of growing an in-house team." },
  { title: "Enhanced Efficiency", icon: "Zap", text: "Advanced tools such as Revit, Bluebeam, AutoCAD and PlanSwift give fast, accurate and traceable quantities." },
  { title: "Convenience and Flexibility", icon: "SlidersHorizontal", text: "Scale support up or down per project. BoQs delivered in your format — Excel, PDF or your own template." },
  { title: "Time Efficiency", icon: "Timer", text: "Work continues across time zones, so take-offs and BoQs are ready when your team needs them." },
  { title: "Global Reach", icon: "Globe2", text: "Supporting projects in 20+ countries with offices and contacts in the UAE, Kuwait, Australia and Sri Lanka." },
] as const;
