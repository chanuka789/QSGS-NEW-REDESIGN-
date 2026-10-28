"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const steps = [
  {
    tab: "Brief",
    title: "First, we understand the project.",
    text: "We review your drawings, models and specifications, then agree the scope, the standard method of measurement, the output format and the deadline — usually in a short online meeting.",
    points: ["Drawings, BIM models & specifications", "NRM, SMM 7, CESMM 4, POMI or your standard", "Scope, format and programme agreed"],
  },
  {
    tab: "Measure",
    title: "Then, we measure every element.",
    text: "Our graduate quantity surveyors take off quantities from 2D drawings and 3D models using Revit, Bluebeam, AutoCAD and PlanSwift — division by division, with clear take-off sheets.",
    points: ["2D & 3D take-offs", "Architectural, structural, M&E and infrastructure", "Marked-up drawings when needed"],
  },
  {
    tab: "Advise",
    title: "We check, compare and clarify.",
    text: "Quantities are checked against drawings and specifications. Discrepancies are flagged early, tender queries are prepared, and design changes are tracked in comparison reports.",
    points: ["Rigorous quality checks", "Tender queries & discrepancy reports", "BoQ revision and comparison reports"],
  },
  {
    tab: "Deliver",
    title: "Finally, you receive clear documents.",
    text: "You receive complete, well-organised Bills of Quantities and supporting documents in Excel and PDF — in your own template if you prefer — ready for tender, pricing or cost planning.",
    points: ["BoQs in Excel & PDF", "Take-off sheets & documentation", "Remote delivery, worldwide"],
  },
];

const DURATION = 7000;

export function Approach() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (paused || !inView) return;
    const t = setTimeout(() => setI((v) => (v + 1) % steps.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, inView]);

  const s = steps[i];
  return (
    <section ref={ref} className="section bg-brand text-white" aria-labelledby="approach-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="container-x">
        <SectionHeading id="approach-title" invert eyebrow="Our approach" title={["A clear path", "from drawings to BoQ."]} />

        <div role="tablist" aria-label="Our approach steps" className="mt-10 grid grid-cols-4 gap-3 sm:gap-6">
          {steps.map((st, k) => (
            <button
              key={st.tab}
              role="tab"
              type="button"
              aria-selected={k === i}
              aria-controls="approach-panel"
              onClick={() => setI(k)}
              className="group text-left"
            >
              <span className={cn("t-xs block tabular-nums transition-colors", k === i ? "text-white" : "text-white/80")}>{String(k + 1).padStart(2, "0")}</span>
              <span className={cn("t-h4 mt-1.5 block transition-colors", k === i ? "text-white" : "text-white/80 group-hover:text-white")}>
                {st.tab}
              </span>
              <span className="relative mt-3 block h-[2px] overflow-hidden rounded-full bg-white/20">
                {k === i && (
                  <motion.span
                    key={`${i}-${paused}-${inView}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    initial={{ width: paused || !inView ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused || !inView ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                )}
                {k < i && <span className="absolute inset-0 bg-white/45" />}
              </span>
            </button>
          ))}
        </div>

        <div id="approach-panel" role="tabpanel" className="mt-10 min-h-[260px] lg:mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
            >
              <div>
                <h3 className="t-h2 !text-white">{s.title}</h3>
                <p className="t-lead mt-5 max-w-2xl !text-white/80">{s.text}</p>
              </div>
              <ul className="self-end border-t border-white/20">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-4 t-body border-b border-white/20 py-4 !text-white/90">
                    <span className="h-px w-4 bg-white/70" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
