"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLong } from "@/components/ui/ArrowLong";
import Image from "next/image";
import { routes } from "@/lib/site";
import { mediaItems, mediaUrl, sectorLabel, type Sector } from "@/lib/media";

type Group = "All projects" | "Residential" | "Commercial" | "Hotels & Resorts" | "Infrastructure" | "Civic & Community";
const groupOf: Record<Sector, Exclude<Group, "All projects">> = {
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Commercial",
  hospitality: "Hotels & Resorts",
  infrastructure: "Infrastructure",
  expressways: "Infrastructure",
  landscape: "Infrastructure",
  cultural: "Civic & Community",
  educational: "Civic & Community",
  healthcare: "Civic & Community",
  recreational: "Civic & Community",
};
const filters: Group[] = ["All projects", "Residential", "Commercial", "Hotels & Resorts", "Infrastructure", "Civic & Community"];
const PAGE = 9;

export function ProjectsGallery() {
  const [f, setF] = useState<Group>("All projects");
  const [shown, setShown] = useState(PAGE);
  const all = mediaItems.filter((m) => f === "All projects" || groupOf[m.sector] === f);
  const list = all.slice(0, shown);
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
          <p className="t-xs shrink-0 text-muted lg:pb-1">{mediaItems.length} project visuals</p>
        </div>

        <div role="tablist" aria-label="Filter projects" className="mt-10 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {filters.map((x) => (
            <button key={x} role="tab" type="button" aria-selected={f === x} onClick={() => { setF(x); setShown(PAGE); }} className="tab">
              {x}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <motion.li
                layout="position"
                key={p.file}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={routes.contact} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-paper-2">
                    <Image
                      src={mediaUrl(p.file)}
                      alt={p.alt}
                      fill
                      sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-liquid)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="t-h4 text-ink transition-colors group-hover:text-brand">{p.title}</h3>
                      <p className="t-small mt-1 text-muted">
                        {sectorLabel[p.sector]}
                        <span className="sr-only"> — discuss a similar project</span>
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

        {shown < all.length && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-outline">
              Show more projects <span className="t-small text-muted">({all.length - shown})</span>
            </button>
          </div>
        )}

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
