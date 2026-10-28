import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, ChevronDown, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { LinkRows } from "@/components/ui/LinkRows";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { posts, readingMinutes, type ArticleBlock, type Post } from "@/lib/posts";
import { SITE_URL, company, quoteHref, routes } from "@/lib/site";

const date = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Reading text: slightly larger and darker than UI copy for comfortable long-form reading. */
const prose = "text-[1rem] leading-[1.8] text-ink-2 sm:text-[1.0625rem]";

function Block({ b }: { b: ArticleBlock }) {
  switch (b.type) {
    case "h2":
      return <h2 id={b.id} className="t-h3 mt-12 scroll-mt-28 text-ink first:mt-0 sm:mt-14">{b.text}</h2>;
    case "h3":
      return <h3 className="t-h4 mt-8 text-ink">{b.text}</h3>;
    case "p":
      return <p className={`mt-4 ${prose}`}>{b.text}</p>;
    case "list":
      return (
        <ul className="mt-5 space-y-3">
          {b.items.map((it) => (
            <li key={it.text.slice(0, 24)} className={`flex gap-3 ${prose}`}>
              <span className="mt-[0.9em] h-px w-3 shrink-0 bg-brand" aria-hidden />
              <span className="min-w-0">
                {it.title && <strong className="font-medium text-ink">{it.title}: </strong>}
                {it.text}
              </span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <>
          {/* Phones: each row becomes a stacked block, so nothing scrolls sideways */}
          <dl className="mt-6 border-t border-ink sm:hidden">
            {b.rows.map((r) => (
              <div key={r[0]} className="border-b border-line py-4">
                <dt className="t-h4 text-ink">{r[0]}</dt>
                {r.slice(1).map((c, i) => (
                  <dd key={i} className="mt-2">
                    <span className="t-xs block uppercase tracking-[0.12em] text-muted">{b.head[i + 1]}</span>
                    <span className="t-small mt-0.5 block text-ink-2">{c}</span>
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          {/* Tablet and desktop: a real table */}
          <div className="mt-6 hidden sm:block">
            <table className="t-small w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-ink">
                  {b.head.map((h) => (
                    <th key={h} scope="col" className="py-3 pr-5 font-medium text-ink">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-line align-top">
                    {r.map((c, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="w-[26%] py-3.5 pr-5 font-medium text-ink">{c}</th>
                      ) : (
                        <td key={i} className="py-3.5 pr-5 text-ink-2">{c}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "links":
      return (
        <p className="mt-5 flex flex-wrap gap-2">
          {b.items.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="t-small inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-medium text-brand shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-brand)]"
            >
              {l.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
          ))}
        </p>
      );
  }
}

function Toc({ items }: { items: { id: string; text: string }[] }) {
  const list = (
    <ol className="t-small space-y-2.5">
      {items.map((h, i) => (
        <li key={h.id} className="flex gap-3">
          <span className="num !text-[0.75rem] pt-0.5">{String(i + 1).padStart(2, "0")}</span>
          <a href={`#${h.id}`} className="text-ink-2 hover:text-brand">{h.text}</a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      {/* Phones and tablets: collapsible, so the article starts straight away */}
      <details className="group rounded-[16px] bg-paper-2 px-5 py-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <span className="eyebrow">On this page · {items.length}</span>
          <ChevronDown className="h-5 w-5 text-brand transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4">{list}</div>
      </details>
      {/* Desktop: sticky side navigation */}
      <nav aria-label="On this page" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <p className="eyebrow mb-4">On this page</p>
        {list}
      </nav>
    </>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function Share({ post }: { post: Post }) {
  const url = encodeURIComponent(`${SITE_URL}${post.path}`);
  const text = encodeURIComponent(post.h1);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, icon: Linkedin },
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${url}`, icon: MessageCircle },
    { label: "Email", href: `mailto:?subject=${text}&body=${url}`, icon: Mail },
  ];
  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-6">
      <span className="t-small text-muted">Share this guide</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="grid h-10 w-10 place-items-center rounded-full text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors hover:bg-brand hover:text-white hover:shadow-none"
        >
          <l.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

/** Long-form post: header with dates and reading time, responsive contents, readable body, share, related pages. */
export function ArticlePage({ post: a }: { post: Post }) {
  const toc = a.blocks.filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2");
  const minutes = readingMinutes(a);
  const others = posts.filter((p) => p.slug !== a.slug).slice(0, 3);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Insights", path: routes.insights }, { name: a.h1, path: a.path }])} />
      <JsonLd
        data={articleJsonLd({ path: a.path, headline: a.title, description: a.seo.description, image: a.image.src, published: a.published, updated: a.updated, section: a.category, words: minutes * 220 })}
      />

      <PageHero crumbs={[{ name: "Insights", href: routes.insights }, { name: a.category }]} eyebrow={a.category} title={[a.h1]} lead={a.lead} image={a.image.src} imageAlt={a.image.alt}>
        <p className="t-small mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
          <span>By {company.name}</span>
          <span aria-hidden>·</span>
          <span>
            Updated <time dateTime={a.updated}>{date(a.updated)}</time>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {minutes} min read
          </span>
        </p>
      </PageHero>

      <article className="section pt-10 lg:pt-16">
        <div className="container-x grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <Toc items={toc} />
          <div className="min-w-0 max-w-[46rem]">
            {a.blocks.map((b, i) => (
              <Block key={i} b={b} />
            ))}
            <p className="t-xs mt-10 text-muted">
              First published <time dateTime={a.published}>{date(a.published)}</time>.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={quoteHref} className="btn btn-primary justify-between sm:justify-center">
                Get a quote <ArrowUpRight className="h-5 w-5" />
              </Link>
              <Link href={routes.contact} className="btn btn-outline justify-between sm:justify-center">
                Schedule an online meeting <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
            <Share post={a} />
          </div>
        </div>
      </article>

      <section className="section bg-paper-2" aria-labelledby="related-title">
        <div className="container-x">
          <SectionHeading id="related-title" eyebrow="Related" title={["Services mentioned in this guide."]} />
          <LinkRows hrefs={a.related} className="mt-10 border-t border-line" />
          {others.length > 0 && (
            <>
              <h2 className="t-h3 mt-14">More insights</h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.path} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-white">
                        <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      </div>
                      <p className="t-h4 mt-4 text-ink group-hover:text-brand">{p.h1}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <div className="pt-16 lg:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
