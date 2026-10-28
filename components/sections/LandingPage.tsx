import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, landingServiceJsonLd, webPageJsonLd } from "@/lib/seo";
import { processSteps, type Landing } from "@/lib/landing";
import { LinkRows } from "@/components/ui/LinkRows";
import { quoteHref, routes, standards } from "@/lib/site";

const parent = {
  service: { name: "Our Services", path: routes.services },
  location: { name: "Our Services", path: routes.services },
  bank: { name: "Our Services", path: routes.services },
} as const;

/** Service, country and Sri Lanka bank pages: one search topic each, original copy, FAQ and related links. */
export function LandingPage({ page: p }: { page: Landing }) {
  const up = parent[p.kind];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([up, { name: p.label, path: p.path }])} />
      <JsonLd data={webPageJsonLd({ path: p.path, name: p.seo.title, description: p.seo.description })} />
      <JsonLd data={landingServiceJsonLd({ path: p.path, name: p.serviceName, description: p.seo.description, areaServed: p.areaServed, image: p.image.src })} />

      <PageHero
        crumbs={[{ name: up.name, href: up.path }, { name: p.label }]}
        eyebrow={p.eyebrow}
        title={[p.h1]}
        lead={p.lead}
        image={p.image.src}
        imageAlt={p.image.alt}
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link href={quoteHref} className="btn btn-primary w-full justify-between sm:w-auto sm:justify-center">
            Get a quote <ArrowUpRight className="h-5 w-5" />
          </Link>
          {p.contact?.phone && (
            <a href={p.contact.phoneHref} className="link-arrow">
              <Phone className="h-4 w-4" /> {p.contact.country}: {p.contact.phone}
            </a>
          )}
        </div>
      </PageHero>

      {/* Intro */}
      <section className="section" aria-labelledby="intro-title">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading id="intro-title" eyebrow="Overview" title={[p.intro.title]} />
          <Reveal className="space-y-5">
            {p.intro.paragraphs.map((t) => (
              <p key={t.slice(0, 24)} className="t-body">
                {t}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Deliverables: numbered rows */}
      <section className="section border-t border-line" aria-labelledby="deliver-title">
        <div className="container-x">
          <SectionHeading id="deliver-title" eyebrow="Deliverables" title={[p.deliverables.title + "."]} />
          <ol className="mt-10 grid border-t border-line md:grid-cols-2 md:gap-x-12">
            {p.deliverables.items.map((d, i) => (
              <li key={d.title} className="grid grid-cols-[40px_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[56px_1fr]">
                <span className="num pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="t-h4 text-ink">{d.title}</h3>
                  <p className="t-small mt-1.5 text-muted">{d.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Topic sections */}
      {p.sections.map((s, i) => (
        <section key={s.title} className={i % 2 === 0 ? "section bg-paper-2" : "section"} aria-labelledby={`topic-${i}`}>
          <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading id={`topic-${i}`} title={[s.title + "."]} />
            <Reveal className="space-y-5">
              {s.paragraphs.map((t) => (
                <p key={t.slice(0, 24)} className="t-body">
                  {t}
                </p>
              ))}
              {s.bullets && (
                <ul className="grid gap-3 pt-2 sm:grid-cols-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="t-small flex gap-3 text-ink-2">
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-brand" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </section>
      ))}

      {/* How we work */}
      <section className="section border-t border-line" aria-labelledby="process-title">
        <div className="container-x">
          <SectionHeading id="process-title" eyebrow="How we work" title={["From drawings to documents in four steps."]} />
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <li key={s.title} className="border-t border-ink pt-5">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h4 mt-3 text-ink">{s.title}</h3>
                <p className="t-small mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="t-small mt-10 text-muted">
            Standards: <span className="text-ink-2">{standards.join(" · ")}</span>
          </p>
        </div>
      </section>

      {/* Local contact */}
      {p.contact && (
        <section className="container-x" aria-label={`${p.contact.country} contact`}>
          <div className="flex flex-col gap-4 rounded-[16px] bg-paper-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="t-h4 text-ink">Your {p.contact.country} contact</p>
            <div className="t-small flex flex-col gap-2 sm:flex-row sm:gap-8">
              {p.contact.phone && (
                <a href={p.contact.phoneHref} className="flex items-center gap-2 text-ink-2 hover:text-brand">
                  <Phone className="h-4 w-4 text-brand" /> {p.contact.phone}
                </a>
              )}
              <a href={`mailto:${p.contact.email}`} className="flex items-center gap-2 text-ink-2 hover:text-brand">
                <Mail className="h-4 w-4 text-brand" /> {p.contact.email}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading id="faq-title" eyebrow="FAQ" title={["Questions we are often asked."]} />
          <div className="border-t border-line">
            {p.faqs.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="t-h4 text-ink transition-colors group-hover:text-brand">{f.q}</h3>
                  <span className="relative mt-1.5 h-4 w-4 shrink-0 text-brand" aria-hidden>
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="t-body max-w-2xl pb-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="section bg-paper-2" aria-labelledby="related-title">
        <div className="container-x">
          <SectionHeading id="related-title" eyebrow="Related" title={["You may also need."]} />
          <LinkRows hrefs={p.related} className="mt-10 border-t border-line" />
        </div>
      </section>

      <div className="pt-16 lg:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
