import { LazyScene } from "@/components/three/LazyScene";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { offices } from "@/lib/site";

const named = ["Australia", "New Zealand", "UK", "USA", "Canada", "Singapore", "All European countries", "UAE", "Middle East countries"];

export function GlobalReach() {
  return (
    <section className="relative overflow-hidden bg-paper-2/60 px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="reach-title">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading id="reach-title" eyebrow="Global reach" title={["Expanding horizons with", "comprehensive quantity", "surveying services."]} size="md" />
          <Reveal delay={0.1}>
            <p className="mt-10 flex items-baseline gap-4">
              <span className="text-[clamp(4.5rem,10vw,8rem)] font-medium leading-none tracking-[-0.03em] text-ink">20+</span>
              <span className="text-[1.3rem] font-medium tracking-tight text-muted">Countries</span>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-[1.02rem] leading-[1.75] text-muted">
              We are proud to offer our expert quantity surveying services to clients around the globe. Our commitment to excellence and precision knows no borders, enabling us to support projects in various countries with unmatched expertise and dedication. Whether you’re in Australia, New Zealand, UK, USA, Canada, Singapore, all European countries, UAE or any Middle East countries, our remote services ensure that you receive the highest quality surveying solutions tailored to your specific needs.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-[0.95rem] text-ink-2" aria-label="Countries and regions we serve">
              {named.map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal y={40} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[620px]">
            <LazyScene scene="globe" className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-wrap justify-center gap-2">
              {offices.map((o) => (
                <span key={o.country} className="glass glass-pill glass-strong inline-flex items-center gap-2 px-4 py-2 text-[0.82rem] font-medium text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> {o.country}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-5 text-center text-[0.82rem] text-muted">Drag to spin · Offices in UAE, Kuwait, Australia and Sri Lanka</p>
        </Reveal>
      </div>
    </section>
  );
}
