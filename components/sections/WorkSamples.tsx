"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

const rowA = [
  { src: "/images/work/takeoff-3d-model.webp", label: "3D model take-off" },
  { src: "/images/work/boq-sheet.webp", label: "Bill of Quantities — substructure" },
  { src: "/images/work/takeoff-2d-plan.webp", label: "2D plan measurement" },
  { src: "/images/work/boq-summary.webp", label: "BoQ summary" },
  { src: "/images/work/takeoff-3d-tower.webp", label: "Tower model quantities" },
];
const rowB = [
  { src: "/images/work/boq-cover.webp", label: "Tender BoQ document" },
  { src: "/images/work/takeoff-cad.webp", label: "AutoCAD take-off" },
  { src: "/images/work/boq-concrete.webp", label: "Concrete works BoQ" },
  { src: "/images/work/takeoff-markup.webp", label: "Marked-up drawings" },
  { src: "/images/work/takeoff-collage.webp", label: "Take-off documentation" },
];

/** Two rows of real deliverables drifting in opposite directions as you scroll. */
export function WorkSamples() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], ["2%", "-30%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-30%", "2%"]);
  return (
    <div ref={ref} className="relative space-y-6 overflow-hidden py-2 sm:space-y-8" aria-label="Samples of our take-off and BoQ deliverables">
      {[{ row: rowA, x: xA }, { row: rowB, x: xB }].map(({ row, x }, r) => (
        <motion.div key={r} style={reduce ? undefined : { x }} className="flex w-max gap-5 sm:gap-8">
          {[...row, ...row.slice(0, 2)].map((it, i) => (
            <figure key={i} className="group w-[250px] shrink-0 sm:w-[360px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-white">
                <Image src={it.src} alt={it.label} fill sizes="360px" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <figcaption className="mt-3 flex items-center gap-3 text-[0.88rem] text-muted">
                <span className="h-px w-4 bg-brand" aria-hidden />
                {it.label}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
