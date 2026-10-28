import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { article, type ArticleBlock } from "@/lib/article";
import { company, routes } from "@/lib/site";

const date = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Block({ b }: { b: ArticleBlock }) {
  switch (b.type) {
    case "h2":
      return <h2 id={b.id} className="t-h3 mt-14 scroll-mt-28 text-ink first:mt-0">{b.text}</h2>;
    case "h3":
      return <h3 className="t-h4 mt-8 text-ink">{b.text}</h3>;
    case "p":
      return <p className="t-body mt-4">{b.text}</p>;
    case "list":
      return (
        <ul className="mt-5 space-y-3">
          {b.items.map((it) => (
            <li key={it.text.slice(0, 24)} className="t-body flex gap-3">
              <span className="mt-[0.8em] h-px w-3 shrink-0 bg-brand" aria-hidden />
              <span>
                {it.title && <strong className="font-medium text-ink">{it.title}: </strong>}
                {it.text}
              </span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto">
          <table className="t-small w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink">
                {b.head.map((h) => (
                  <th key={h} scope="col" className="py-3 pr-6 font-medium text-ink">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]} className="border-b border-line align-top">
                  {r.map((c, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-3 pr-6 font-medium text-ink">{c}</th>
                    ) : (
                      <td key={i} className="py-3 pr-6 text-muted">{c}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "links":
      return (
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {b.items.map((l) => (
            <Link key={l.href} href={l.href} className="t-small inline-flex items-center gap-1 font-medium text-brand hover:underline">
              {l.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
          ))}
        </p>
      );
  }
}

/** Long-form guide: table of contents, dated byline and links into the service pages. */
export function ArticlePage() {
  const a = article;
  const toc = a.blocks.filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Remote quantity surveying in the UAE", path: a.path }])} />
      <JsonLd data={articleJsonLd({ path: a.path, headline: a.title, description: a.seo.description, image: a.image.src, published: a.published, updated: a.updated })} />

      <PageHero crumbs={[{ name: "Remote quantity surveying in the UAE" }]} eyebrow="Guide" title={[a.h1]} lead={a.lead} image={a.image.src} imageAlt={a.image.alt}>
        <p className="t-small mt-6 text-muted">
          By {company.name} · Published <time dateTime={a.published}>{date(a.published)}</time> · Updated <time dateTime={a.updated}>{date(a.updated)}</time>
        </p>
      </PageHero>

      <article className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">On this page</p>
            <ol className="t-small mt-4 space-y-2.5">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-muted hover:text-brand">{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-[46rem]">
            {a.blocks.map((b, i) => (
              <Block key={i} b={b} />
            ))}
            <p className="mt-12">
              <Link href={routes.contact} className="btn btn-primary">
                Schedule an online meeting <ArrowUpRight className="h-5 w-5" />
              </Link>
            </p>
          </div>
        </div>
      </article>

      <CtaBand />
    </>
  );
}
