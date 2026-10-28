import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/sections/ArticlePage";
import { buildMetadata } from "@/lib/seo";
import { postBySlug, posts } from "@/lib/posts";

/** Every Insights post, at its own root URL (/<slug>/). Unknown slugs return 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ post: p.slug }));
}

type Props = { params: Promise<{ post: string }> };

export async function generateMetadata({ params }: Props) {
  const p = postBySlug((await params).post);
  if (!p) return {};
  return buildMetadata({
    path: p.path,
    title: p.seo.title,
    description: p.seo.description,
    ogLabel: p.h1,
    type: "article",
    article: { published: p.published, modified: p.updated, section: p.category },
  });
}

export default async function PostRoute({ params }: Props) {
  const p = postBySlug((await params).post);
  if (!p) notFound();
  return <ArticlePage post={p} />;
}
