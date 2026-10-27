import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { ParallaxImage } from "@/components/ui/Parallax";
import { benefits } from "@/lib/services";
import { routes } from "@/lib/site";

export function WhyChoose() {
  return (
    <section className="px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="why-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <SectionHeading id="why-title" eyebrow="Why choose us" title={["Benefits of our remote", "quantity surveying services."]} />
            <Reveal delay={0.2}>
              <Link href={routes.services} className="link-arrow mt-10 text-[1.05rem]">
                Our services <ArrowLong />
              </Link>
            </Reveal>
          </div>
          <Reveal y={40}>
            <ParallaxImage src="/images/photos/drawings.webp" alt="Quantity surveyor measuring construction drawings" className="aspect-[16/11] rounded-[6px]" sizes="(min-width:1024px) 50vw, 100vw" />
          </Reveal>
        </div>
        <Stagger className="mt-20 grid border-t border-ink md:grid-cols-2 lg:grid-cols-3" gap={0.07}>
          {benefits.map((b, i) => (
            <StaggerItem key={b.title} className="border-b border-line py-10 md:pr-10">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[1.55rem] font-medium leading-tight tracking-[-0.025em]">{b.title}</h3>
              <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-muted">{b.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
