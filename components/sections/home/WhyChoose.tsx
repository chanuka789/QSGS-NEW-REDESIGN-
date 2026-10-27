import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { benefits } from "@/lib/services";
import { routes } from "@/lib/site";

export function WhyChoose() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading id="why-title" eyebrow="Why choose us" title={["Benefits of our remote quantity surveying services."]} />
          <Reveal delay={0.1}>
            <Link href={routes.services} className="link-arrow shrink-0">
              Our services <ArrowLong />
            </Link>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid gap-x-8 gap-y-10 border-t border-line pt-10 md:grid-cols-2 lg:grid-cols-3" gap={0.06}>
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <span className="glass-icon h-11 w-11">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <h3 className="t-h3 mt-5">{b.title}</h3>
              <p className="t-body mt-2 max-w-sm">{b.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
