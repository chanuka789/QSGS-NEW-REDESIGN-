"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import Image from "next/image";
import { routes } from "@/lib/site";

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
  { title: "Cultural pavilion", cat: "Commercial", meta: "Take-off quantities", img: "/images/projects/cultural-pavilion.webp" },
];
const filters = ["All projects", "Residential", "Commercial", "Hospitality", "Infrastructure"] as const;

export function ProjectsGallery() {
  const [f, setF] = useState<(typeof filters)[number]>("All projects");
  const list = projects.filter((p) => f === "All projects" || p.cat === f);
  return (
    <section className="section" aria-labelledby="projects-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            id="projects-title"
            eyebrow="Projects"
            title={["The detail behind the bigger picture."]}
            lead="How precise measurement supports different kinds of projects — from residential blocks to hotels and infrastructure."
          />
          <p className="t-xs shrink-0 text-muted lg:pb-1">Illustrative project studies</p>
        </div>

        <div role="tablist" aria-label="Filter projects" className="mt-10 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {filters.map((x) => (
            <button key={x} role="tab" type="button" aria-selected={f === x} onClick={() => setF(x)} className="tab">
              {x}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <motion.li
                layout="position"
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={routes.contact} className="group block" aria-label={`${p.title} — discuss a similar project`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-paper-2">
                    <Image
                      src={p.img}
                      alt={`${p.title} (illustrative)`}
                      fill
                      sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-liquid)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="t-h4 text-ink transition-colors group-hover:text-brand">{p.title}</h3>
                      <p className="t-small mt-1 text-muted">
                        {p.cat} · {p.meta}
                      </p>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-none">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-body">Different sectors. The same attention to detail.</p>
          <Link href={routes.contact} className="link-arrow">
            Discuss a similar project <ArrowLong />
          </Link>
        </div>
      </div>
    </section>
  );
}
