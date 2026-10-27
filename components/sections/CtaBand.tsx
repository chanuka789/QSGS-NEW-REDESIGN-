import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { company, routes } from "@/lib/site";

export function CtaBand({
  eyebrow = "Start a conversation",
  title = "Let’s measure your next project.",
  text = "Share your drawings and we will come back with a scope, timeline and quote.",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-x pb-16 lg:pb-24" aria-labelledby="cta-title">
      <Reveal>
        <div className="grid gap-8 rounded-[24px] bg-brand px-7 py-10 text-white sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-14 lg:py-14">
          <div>
            <p className="eyebrow !text-white/70">{eyebrow}</p>
            <h2 id="cta-title" className="t-h2 mt-4 !text-white">
              {title}
            </h2>
            <p className="t-lead mt-4 max-w-xl !text-white/80">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <Link href={routes.contact} className="btn bg-white text-brand hover:bg-brand-50">
              Schedule an online meeting <ArrowUpRight className="h-5 w-5" />
            </Link>
            <a href={`mailto:${company.email}`} className="btn text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.4)] hover:bg-white/10">
              <Mail className="h-4 w-4" /> {company.email}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
