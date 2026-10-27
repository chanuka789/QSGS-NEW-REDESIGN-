"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { ParallaxImage } from "@/components/ui/Parallax";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";

// Illustrative studies with placeholder images — replace with real projects when available.
const projects = [
  { title: "Courtyard residential block", cat: "Residential", meta: "Take-off quantities · BoQ preparation", img: "/images/projects/residential-courtyard.webp" },
  { title: "Glass office tower", cat: "Commercial", meta: "Bills of quantities · Revisions", img: "/images/projects/commercial-tower.webp" },
  { title: "Hotel tower & podium", cat: "Hospitality", meta: "Tender documents · BoQ", img: "/images/projects/hotel-tower.webp" },
  { title: "Waterfront district", cat: "Infrastructure", meta: "Infrastructure take-off", img: "/images/projects/waterfront-skyline.webp" },
  { title: "Hillside housing", cat: "Residential", meta: "BoQ review · Comparison report", img: "/images/projects/hillside-housing.webp" },
  { title: "Corporate headquarters", cat: "Commercial", meta: "Tender queries · Variations", img: "/images/projects/corporate-hq.webp" },
  { title: "Mixed-use urban block", cat: "Commercial", meta: "3D model quantification", img: "/images/projects/mixed-use-night.webp" },
  { title: "Resort residences", cat: "Hospitality", meta: "2D & 3D take-offs", img: "/images/projects/wave-residences.webp" },
];
const filters = ["All projects", "Residential", "Commercial", "Hospitality", "Infrastructure"] as const;

export function ProjectsGallery() {
  const [f, setF] = useState<(typeof filters)[number]>("All projects");
  const list = projects.filter((p) => f === "All projects" || p.cat === f);
  return (
    <section className="px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="projects-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading id="projects-title" eyebrow="Projects" title={["The detail behind", "the bigger picture."]} />
          <div>
            <p className="lead">Explore how precise measurement supports different kinds of projects — from residential blocks to hotels and infrastructure.</p>
            <p className="mt-3 text-[0.85rem] tracking-[0.06em] text-brand">Illustrative project studies</p>
          </div>
        </div>

        <div role="tablist" aria-label="Filter projects" className="mt-12 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {filters.map((x) => (
            <button key={x} role="tab" type="button" aria-selected={f === x} onClick={() => setF(x)} className="tab">
              {x}
            </button>
          ))}
        </div>

        <motion.ul layout className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                layout
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(i % 4 === 1 && "md:mt-24", i % 4 === 3 && "md:mt-24")}
              >
                <Link href={routes.contact} className="group block" aria-label={`${p.title} — discuss a similar project`}>
                  <ParallaxImage src={p.img} alt={`${p.title} (illustrative)`} className={cn("rounded-[6px]", i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")} sizes="(min-width: 768px) 50vw, 100vw" strength={8} imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-liquid)] group-hover:scale-[1.04]" />
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-[1.6rem] font-medium leading-tight tracking-[-0.025em]">{p.title}</h3>
                      <p className="mt-2 text-[0.95rem] text-muted">
                        {p.cat} · {p.meta}
                      </p>
                    </div>
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgb(16_36_46/0.22)] transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand group-hover:text-white group-hover:shadow-none">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="mt-20 border-t border-line pt-10">
          <p className="text-muted">Different sectors. The same attention to detail.</p>
          <Link href={routes.contact} className="link-arrow mt-6 text-[1.05rem]">
            Discuss a similar project <ArrowLong />
          </Link>
        </div>
      </div>
    </section>
  );
}
