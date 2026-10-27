"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight, Box, Layers3, Pause, RotateCw } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { LazyScene } from "@/components/three/LazyScene";
import type { BuildingView } from "@/components/three/BuildingScene";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";

const facts = [
  { k: "20+", v: "Countries served remotely" },
  { k: "2D & 3D", v: "Take-offs from drawings & models" },
  { k: "NRM · SMM7 · CESMM4", v: "Standard methods of measurement" },
];

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [view, setView] = useState<BuildingView>("design");
  const [rotate, setRotate] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section ref={ref} className="relative px-5 pt-28 sm:px-8 lg:pt-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-4 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
        <div className="relative z-10 lg:pb-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.8 }} className="eyebrow">
            Quantity Surveying Global Solutions
          </motion.p>

          <SplitText
            as="h1"
            immediate
            delay={0.15}
            parts={["Remote quantity surveying,", "measured with precision."]}
            className="display mt-6 text-[clamp(2.5rem,4.6vw,4.3rem)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease }}
            className="lead mt-8 max-w-[33rem]"
          >
            Industry-leading remote quantity surveying for diverse project needs. Accurate take-offs, BOQ preparation and cost management — from anywhere in the world, without the need for on-site presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease }}
            className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-9"
          >
            <Link href={routes.contact} className="btn btn-primary btn-lg w-full justify-between sm:w-auto sm:justify-center">
              Get a quote <ArrowUpRight className="h-5 w-5" />
            </Link>
            <Link href={routes.contact} className="link-arrow text-[1.02rem]">
              Schedule an online meeting <ArrowLong />
            </Link>
          </motion.div>
        </div>

        <motion.div style={reduce ? undefined : { y: sceneY }} className="relative -mx-5 sm:-mx-8 lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1.4, ease }}
            className="relative h-[420px] sm:h-[520px] lg:h-[620px]"
          >
            <LazyScene
              scene="building"
              view={view}
              rotate={rotate}
              className="h-full w-full [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_60%,transparent_100%)]"
              fallback={<div className="absolute inset-0 grid place-items-center text-sm text-muted">Loading 3D model…</div>}
            />
          </motion.div>

          {/* Liquid glass model controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease }}
            className="absolute inset-x-0 bottom-2 z-10 flex justify-center px-4 sm:bottom-6"
          >
            <div role="group" aria-label="3D model view" className="glass glass-pill glass-lens-strong flex items-center gap-1 p-1.5">
              {(
                [
                  { id: "design", label: "Design view", short: "Design", icon: Box },
                  { id: "exploded", label: "Exploded view", short: "Exploded", icon: Layers3 },
                ] as const
              ).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={view === b.id}
                  onClick={() => setView(b.id)}
                  className={cn(
                    "relative flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-[0.88rem] transition-colors sm:px-5 sm:text-[0.93rem]",
                    view === b.id ? "text-brand" : "text-ink-2/70 hover:text-ink",
                  )}
                >
                  {view === b.id && (
                    <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-brand-50" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <b.icon className="relative h-4 w-4" strokeWidth={1.6} />
                  <span className="relative whitespace-nowrap">
                    <span className="sm:hidden">{b.short}</span>
                    <span className="hidden sm:inline">{b.label}</span>
                  </span>
                </button>
              ))}
              <span className="mx-1 h-6 w-px bg-ink/15" aria-hidden />
              <button
                type="button"
                aria-pressed={rotate}
                onClick={() => setRotate((r) => !r)}
                className="flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-[0.88rem] text-ink-2/80 transition-colors hover:text-ink sm:px-5 sm:text-[0.93rem]"
              >
                {rotate ? <Pause className="h-4 w-4" strokeWidth={1.6} /> : <RotateCw className="h-4 w-4" strokeWidth={1.6} />}
                {rotate ? "Pause" : "Rotate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto mt-10 max-w-[1320px] lg:mt-6">
        <div className="rule" />
        <dl className="grid gap-6 py-8 sm:grid-cols-3 sm:gap-10">
          {facts.map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.8, ease }}
              className="flex items-baseline gap-4"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <dt className="text-[1.15rem] font-medium tracking-tight text-ink">{f.k}</dt>
                <dd className="mt-1 text-[0.92rem] text-muted">{f.v}</dd>
              </div>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
