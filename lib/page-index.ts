import { posts } from "./posts";
import { routes } from "./site";
import { landings } from "./landing";
import { segments } from "./services";

/** Label + one-line summary for any internal page, used by "related pages" link lists. */
export const pageIndex: Record<string, { label: string; summary: string }> = Object.fromEntries([
  ...landings.map((l) => [l.path, { label: l.kind === "location" ? `Quantity surveying in ${l.key === "uae" ? "the UAE" : l.label}` : l.label, summary: l.summary }]),
  ...segments.map((s) => [s.href, { label: `For ${s.label}`, summary: s.cardText }]),
  ...posts.map((p) => [p.path, { label: `${p.category}: ${p.h1}`, summary: p.excerpt }]),
  [routes.insights, { label: "Insights", summary: "Guides on quantity surveying, BOQs and cost planning." }],
]);
