import type { Metadata } from "next";
import { SITE_URL, company, offices, markets, routes } from "./site";

type PageSeo = {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  type?: "website" | "article";
  /** Short label printed on the generated social-share image. */
  ogLabel?: string;
};

export function buildMetadata(p: PageSeo): Metadata {
  const og = `/api/og/?title=${encodeURIComponent(p.ogLabel ?? p.ogTitle ?? p.title)}`;
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: p.path },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      type: p.type ?? "article",
      locale: "en_US",
      url: p.path,
      siteName: company.name,
      title: p.ogTitle ?? p.title,
      description: p.ogDescription ?? p.description,
      images: [{ url: og, width: 1200, height: 630, alt: p.ogTitle ?? p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.twitterTitle ?? p.ogTitle ?? p.title,
      description: p.ogDescription ?? p.description,
      images: [og],
    },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: company.name,
        alternateName: [company.shortName, "QS Global Solutions"],
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-512.png`, width: 512, height: 512 },
        image: `${SITE_URL}/brand/logo-512.png`,
        email: company.email,
        description: company.description,
        areaServed: markets.map((m) => ({ "@type": "Place", name: m.name })),
        knowsAbout: [
          "Quantity surveying",
          "Quantity take-off",
          "Bill of Quantities (BoQ) preparation",
          "Tender documents",
          "Cost estimation",
          "NRM 1",
          "NRM 2",
          "SMM7",
          "CESMM4",
        ],
        contactPoint: offices.map((o) => ({
          "@type": "ContactPoint",
          contactType: "customer service",
          areaServed: o.code,
          email: o.email,
          ...(o.phone ? { telephone: o.phone.replace(/\s/g, "") } : {}),
          availableLanguage: ["English"],
        })),
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: `${SITE_URL}/`,
        name: company.name,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function webPageJsonLd(opts: { path: string; name: string; description: string; type?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${SITE_URL}${opts.path}#webpage`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function serviceJsonLd(opts: { path: string; name: string; description: string; audience: string; services: { name: string; description: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${opts.path}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: "Quantity Surveying",
    provider: { "@id": ORG_ID },
    audience: { "@type": "BusinessAudience", audienceType: opts.audience },
    areaServed: markets.map((m) => m.name),
    url: `${SITE_URL}${opts.path}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: opts.name,
      itemListElement: opts.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description },
      })),
    },
  };
}

export function jobPostingJsonLd(opts: { title: string; description: string; datePosted: string; employmentType: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opts.title,
    description: opts.description,
    datePosted: opts.datePosted,
    employmentType: opts.employmentType,
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: offices.map((o) => ({ "@type": "Country", name: o.country })),
    hiringOrganization: { "@type": "Organization", name: company.name, sameAs: `${SITE_URL}/`, logo: `${SITE_URL}/brand/logo-512.png` },
    directApply: true,
    url: `${SITE_URL}${routes.careers}`,
  };
}
