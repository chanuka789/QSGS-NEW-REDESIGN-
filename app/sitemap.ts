import type { MetadataRoute } from "next";
import { SITE_URL, routes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: routes.home, priority: 1, changeFrequency: "weekly" },
    { path: routes.services, priority: 0.9, changeFrequency: "monthly" },
    { path: routes.consultants, priority: 0.9, changeFrequency: "monthly" },
    { path: routes.developers, priority: 0.9, changeFrequency: "monthly" },
    { path: routes.contractors, priority: 0.9, changeFrequency: "monthly" },
    { path: routes.architects, priority: 0.9, changeFrequency: "monthly" },
    { path: routes.about, priority: 0.8, changeFrequency: "monthly" },
    { path: routes.team, priority: 0.7, changeFrequency: "monthly" },
    { path: routes.careers, priority: 0.7, changeFrequency: "weekly" },
    { path: routes.contact, priority: 0.8, changeFrequency: "yearly" },
    { path: routes.privacy, priority: 0.2, changeFrequency: "yearly" },
  ];
  return entries.map((e) => ({ url: `${SITE_URL}${e.path}`, lastModified, changeFrequency: e.changeFrequency, priority: e.priority }));
}
