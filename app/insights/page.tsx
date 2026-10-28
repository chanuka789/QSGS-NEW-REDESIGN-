import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { posts, readingMinutes } from "@/lib/posts";
import { SITE_URL, routes } from "@/lib/site";

const seo = {
  path: routes.insights,
  title: "Quantity Surveying Insights & Guides | QSGS",
  description: "Guides on quantity surveying, BOQ preparation, take-offs and cost planning for developers, consultants, contractors and architects in the GCC and beyond.",
};

export const metadata = buildMetadata({ ...seo, ogLabel: "Insights", type: "website" });

const date = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function InsightsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Insights", path: routes.insights }])} />
      <JsonLd data={webPageJsonLd({ path: routes.insights, name: seo.title, description: seo.description, type: "CollectionPage" })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${p.path}`, name: p.h1 })),
        }}
      />
      <PageHero
        crumbs={[{ name: "Insights" }]}
        eyebrow="Insights"
        title={["Quantity surveying insights and guides."]}
        lead="Practical guides on take-offs, Bills of Quantities, cost planning and working with a remote quantity surveying team."
      />

      <section className="section pt-10 lg:pt-14" aria-label="All posts">
        <ul className="container-x grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link href={p.path} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-paper-2">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
                    loading={i < 3 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="t-xs mt-5 flex flex-wrap items-center gap-x-2 text-muted">
                  <span className="font-medium uppercase tracking-[0.12em] text-brand">{p.category}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={p.updated}>{date(p.updated)}</time>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {readingMinutes(p)} min
                  </span>
                </p>
                <h2 className="t-h3 mt-2 text-ink transition-colors group-hover:text-brand">{p.h1}</h2>
                <p className="t-small mt-2 text-muted">{p.excerpt}</p>
                <span className="link-arrow t-small mt-4 !text-brand">
                  Read the guide <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
