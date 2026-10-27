import { LazyScene } from "@/components/three/LazyScene";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { offices } from "@/lib/site";

const named = ["Australia", "New Zealand", "UK", "USA", "Canada", "Singapore", "All European countries", "UAE", "Middle East countries"];

export function GlobalReach() {
  return (
    <section className="section bg-paper-2" aria-labelledby="reach-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id="reach-title" eyebrow="Global reach" title={["Expanding horizons with comprehensive quantity surveying services."]} />
          <Reveal delay={0.1}>
            <p className="mt-8 flex items-baseline gap-3">
              <span className="t-stat text-brand">20+</span>
              <span className="t-h4 text-ink">Countries</span>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="t-body mt-6 max-w-xl">
              We are proud to offer our expert quantity surveying services to clients around the globe. Our commitment to excellence and precision knows no borders, enabling us to support projects in various countries with unmatched expertise and dedication. Whether you’re in Australia, New Zealand, UK, USA, Canada, Singapore, all European countries, UAE or any Middle East countries, our remote services ensure that you receive the highest quality surveying solutions tailored to your specific needs.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="t-small mt-8 flex flex-wrap gap-2" aria-label="Countries and regions we serve">
              {named.map((n) => (
                <li key={n} className="rounded-full bg-white px-3 py-1.5 text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal y={30} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <LazyScene scene="globe" className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2">
              {offices.map((o) => (
                <span key={o.country} className="t-xs inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> {o.country}
                </span>
              ))}
            </div>
          </div>
          <p className="t-xs mt-4 text-center text-muted">Drag to spin · Offices in UAE, Kuwait, Australia and Sri Lanka</p>
        </Reveal>
      </div>
    </section>
  );
}
