import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceTimeline } from "@/components/sections/ServiceTimeline";
import { CtaBand } from "@/components/sections/CtaBand";
import { Disciplines } from "@/components/sections/Disciplines";
import { Marquee } from "@/components/ui/Marquee";
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

      <PageHero crumbs={[{ name: "Our Services", href: routes.services }, { name: s.label }]} eyebrow={s.eyebrow} title={[s.h1]} lead={s.lead} size="md">
        <Reveal delay={0.45} blur={false}>
          <ol className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3" aria-label="Services on this page">
            {s.modules.map((m, i) => (
              <li key={m.id} className="border-b border-line">
                <a href={`#${m.id}`} className="group flex items-center gap-5 py-5 pr-6">
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[1.05rem] text-ink transition-transform duration-500 group-hover:translate-x-1">{m.short}</span>
                  <ArrowUpRight className="h-4 w-4 rotate-90 text-brand opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </PageHero>

      {/* Gallery strip */}
      <section aria-label="Project visuals" className="mt-20 lg:mt-28">
        <Marquee speed={60}>
          {[...s.gallery, ...s.gallery].map((g, i) => (
            <div key={i} className="relative mx-3 h-[260px] w-[220px] shrink-0 overflow-hidden rounded-[6px] sm:h-[380px] sm:w-[320px]">
              <Image src={g.src} alt={g.alt} fill sizes="320px" className="object-cover" priority={i < 3} />
            </div>
          ))}
        </Marquee>
      </section>

      {/* Disciplines statement */}
      <section className="px-5 py-24 sm:px-8 lg:py-36" aria-labelledby="scope-title">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            id="scope-title"
            eyebrow="Scope"
            size="md"
            title={["We offer 2D and 3D take-off services along with BoQ preparation."]}
            lead="For Architectural, Structural, Mechanical, Electrical (M&E) & Plumbing, Infrastructural, Landscape, Irrigation, ICT and Security systems & Data centers."
          />
          <Disciplines />
        </div>
      </section>

      {/* Scale-rule timeline */}
      <section className="px-5 pb-24 sm:px-8 lg:pb-36" aria-labelledby="services-list-title">
        <div className="mx-auto mb-16 max-w-[1320px] lg:mb-24">
          <SectionHeading id="services-list-title" eyebrow="Our services" title={["What we deliver", `for ${s.label.toLowerCase().replace(" / clients", " & clients")}.`]} />
        </div>
        <ServiceTimeline modules={s.modules} />
      </section>

      {/* Other client groups */}
      <section className="px-5 pb-24 sm:px-8 lg:pb-32" aria-labelledby="other-title">
        <div className="mx-auto max-w-[1320px]">
          <p id="other-title" className="eyebrow">Remote services for</p>
          <ul className="mt-8 border-t border-ink">
            {others.map((o) => (
              <li key={o.key} className="border-b border-line">
                <Link href={o.href} className="group flex items-center justify-between gap-6 py-7">
                  <span className="text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium tracking-[-0.03em] text-ink transition-transform duration-500 group-hover:translate-x-2">{o.label}</span>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgb(16_36_46/0.2)] transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
