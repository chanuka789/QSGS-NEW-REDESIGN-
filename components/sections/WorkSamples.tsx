"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { img } from "@/lib/media";
import { sectorLabel } from "@/lib/media";

const pick = (files: string[]) => files.map((f) => img(`qsgs-${f}.webp`));
const rowA = pick(["residential-07", "commercial-02", "hospitality-05", "infrastructure-02", "residential-08", "cultural-02", "commercial-06"]);
const rowB = pick(["hospitality-04", "residential-13", "commercial-04", "educational-01", "residential-03", "healthcare-01", "expressways-01"]);

/** Two rows of project visuals drifting in opposite directions as you scroll. */
export function WorkSamples() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], ["2%", "-30%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-30%", "2%"]);
  return (
    <div ref={ref} className="relative space-y-6 overflow-hidden py-2 sm:space-y-8" aria-label="Project visuals across sectors">
      {[{ row: rowA, x: xA }, { row: rowB, x: xB }].map(({ row, x }, r) => (
        <motion.div key={r} style={reduce ? undefined : { x }} className="flex w-max gap-5 sm:gap-8">
          {[...row, ...row.slice(0, 2)].map((it, i) => (
            <figure key={i} className="group w-[240px] shrink-0 sm:w-[320px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_var(--color-line)]">
                <Image src={it.src} alt={it.alt} fill sizes="320px" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <figcaption className="t-xs mt-3 flex items-center gap-2.5 text-muted">
                <span className="h-px w-4 bg-brand" aria-hidden />
                {it.title} · {sectorLabel[it.sector]}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
