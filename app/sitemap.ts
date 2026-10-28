import type { MetadataRoute } from "next";
import { SITE_URL, routes } from "@/lib/site";
import { landings } from "@/lib/landing";
import { article } from "@/lib/article";

/** Date the redesigned core pages were last changed. Update it when their content changes. */
const CORE_UPDATED = "2026-10-28";

/**
 * Every indexable page with an honest lastmod (Google uses lastmod when it is accurate,
 * and ignores priority/changefreq). Landing pages also list their main image.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const core = [
    routes.home,
    routes.services,
    routes.developers,
    routes.consultants,
    routes.contractors,
    routes.architects,
    routes.about,
    routes.team,
    routes.careers,
    routes.contact,
    routes.privacy,
  ].map((path) => ({ url: `${SITE_URL}${path}`, lastModified: CORE_UPDATED }));
  const pages = landings.map((l) => ({ url: `${SITE_URL}${l.path}`, lastModified: l.updated, images: [`${SITE_URL}${l.image.src}`] }));
  const guide = { url: `${SITE_URL}${article.path}`, lastModified: article.updated, images: [`${SITE_URL}${article.image.src}`] };
  return [...core, ...pages, guide];
}
