import { ArticlePage } from "@/components/sections/ArticlePage";
import { article } from "@/lib/article";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  path: article.path,
  title: article.seo.title,
  description: article.seo.description,
  ogLabel: "Remote Quantity Surveying in the UAE",
  type: "article",
});

export default function Page() {
  return <ArticlePage />;
}
