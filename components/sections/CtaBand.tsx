import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { Reveal } from "@/components/ui/Reveal";
import { company, routes } from "@/lib/site";

export function CtaBand({
  eyebrow = "Start a conversation",
  title = "Let’s measure your next project.",
  text = "Share your drawings and we will come back with a scope, timeline and quote. Schedule an online meeting with our quantity surveying team today.",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-deep px-5 py-24 sm:px-8 lg:py-36" aria-labelledby="cta-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_40%,#000,transparent)]" />
      <div className="relative mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Reveal>
          <p className="eyebrow !text-brand-200">{eyebrow}</p>
          <h2 id="cta-title" className="display mt-6 text-[clamp(2.6rem,6vw,5.4rem)] !text-paper">
            {title}
          </h2>
          <p className="mt-7 max-w-xl text-[1.1rem] leading-relaxed text-white/65">{text}</p>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-col gap-8 lg:items-end">
          <Link href={routes.contact} className="btn btn-lg w-full justify-between bg-paper text-ink hover:bg-white sm:w-auto sm:justify-center">
            Schedule an online meeting <ArrowUpRight className="h-5 w-5" />
          </Link>
          <a href={`mailto:${company.email}`} className="link-arrow text-[1.05rem] !text-paper [&_.arrow]:!text-brand-200">
            {company.email} <ArrowLong />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
