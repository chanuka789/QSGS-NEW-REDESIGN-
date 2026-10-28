import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceTimeline } from "@/components/sections/ServiceTimeline";
import { CtaBand } from "@/components/sections/CtaBand";
import { Disciplines } from "@/components/sections/Disciplines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { segments, type Segment } from "@/lib/services";
import { routes } from "@/lib/site";

export function SegmentPage({ segment: s }: { segment: Segment }) {
  const others = segments.filter((x) => x.key !== s.key);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Our Services", path: routes.services }, { name: s.label, path: s.href }])} />
      <JsonLd
        data={serviceJsonLd({
          path: s.href,
          name: s.h1,
          description: s.seo.description,
          audience: s.label,
          services: s.modules.map((m) => ({ name: m.title, description: m.intro })),
        })}
      />

      <PageHero crumbs={[{ name: "Our Services", href: routes.services }, { name: s.label }]} eyebrow={s.eyebrow} title={[s.h1]} lead={s.lead}>
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Services on this page">
            {s.modules.map((m, i) => (
              <a key={m.id} href={`#${m.id}`} className="t-small rounded-full px-3.5 py-2 text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors hover:text-brand hover:shadow-[inset_0_0_0_1px_var(--color-brand)]">
                <span className="text-brand">{String(i + 1).padStart(2, "0")}</span> {m.short}
              </a>
            ))}
          </div>
        </Reveal>
      </PageHero>

      {/* Visual strip */}
      <section aria-label="Project visuals" className="container-x mt-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {s.gallery.slice(0, 4).map((g, i) => (
            <Reveal key={g.src} delay={i * 0.06} className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-paper-2">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width:640px) 25vw, 50vw" className="object-cover" loading={i < 2 ? "eager" : "lazy"} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scope */}
      <section className="section" aria-labelledby="scope-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            id="scope-title"
            eyebrow="Scope"
            title={["2D and 3D take-offs with BoQ preparation."]}
            lead="For Architectural, Structural, Mechanical, Electrical (M&E) & Plumbing, Infrastructural, Landscape, Irrigation, ICT and Security systems & Data centers."
          />
          <Disciplines />
        </div>
      </section>

      {/* Chapter navigator */}
      <section className="section border-t border-line" aria-labelledby="services-list-title">
        <div className="container-x mb-12">
          <SectionHeading id="services-list-title" eyebrow="Our services" title={[`What we deliver for ${s.label.toLowerCase().replace(" / clients", " & clients")}.`]} />
        </div>
        <ServiceTimeline modules={s.modules} />
      </section>

      {/* Other client groups */}
      <section className="section bg-paper-2" aria-labelledby="other-title">
        <div className="container-x">
          <SectionHeading id="other-title" eyebrow="Remote services for" title={["Explore our other services."]} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.key}>
                <Link href={o.href} className="group flex h-full flex-col justify-between gap-6 rounded-[16px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-brand)]">
                  <div>
                    <p className="t-h3 text-ink transition-colors group-hover:text-brand">{o.label}</p>
                    <p className="t-small mt-2 text-muted">{o.cardText}</p>
                  </div>
                  <span className="link-arrow t-small !text-brand">
                    View services <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-16 lg:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
