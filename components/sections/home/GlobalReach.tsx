import { LazyScene } from "@/components/three/LazyScene";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { routes, workingCountries } from "@/lib/site";

/** Country chips link to the matching country page where one exists. */
const countryPage: Record<string, string> = { AE: routes.uae, QA: routes.qatar, KW: routes.kuwait, SA: routes.saudi, AU: routes.australia };

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
            <p className="eyebrow mt-8">Countries we work in</p>
            <ul className="t-small mt-3 flex flex-wrap gap-2">
              {workingCountries.map((c) => (
                <li
                  key={c.code}
                  className={
                    c.hub
                      ? "inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-medium text-white"
                      : "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]"
                  }
                >
                  <span className={c.hub ? "h-1.5 w-1.5 rounded-full bg-white" : "h-1.5 w-1.5 rounded-full bg-brand"} aria-hidden />
                  {countryPage[c.code] ? (
                    <Link href={countryPage[c.code]} className="hover:text-brand">
                      {c.name}
                    </Link>
                  ) : (
                    c.name
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal y={30} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <LazyScene scene="globe" className="absolute inset-0" />
          </div>
          <p className="t-xs mt-4 text-center text-muted">Drag to rotate · Every line connects to our team in Sri Lanka</p>
        </Reveal>
      </div>
    </section>
  );
}
