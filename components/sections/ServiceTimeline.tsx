"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ServiceModule } from "@/lib/services";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * "Scale-rule" service timeline: a measuring ruler fills as you scroll,
 * each numbered station lights up when reached, and (on desktop) a sticky
 * panel shows the active service's visual and a live counter.
 */
export function ServiceTimeline({ modules, discussLabel = "Discuss" }: { modules: ServiceModule[]; discussLabel?: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const current = modules[active];

  return (
    <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
      {/* Sticky visual panel (desktop) */}
      <div className="hidden lg:block">
        <div className="sticky top-28 flex h-[calc(100vh-9rem)] max-h-[760px] flex-col">
          <div className="relative flex-1 overflow-hidden rounded-[28px] bg-paper-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={current.image} alt={current.imageAlt} fill sizes="40vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-4 bottom-4">
              <div className="glass glass-strong flex items-center justify-between !rounded-[18px] px-5 py-4">
                <div className="min-w-0">
                  <p className="eyebrow !text-[0.68rem] !tracking-[0.22em] text-muted">Now viewing</p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={current.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="mt-1 truncate text-[1.02rem] font-medium text-ink"
                    >
                      {current.title}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="ml-4 shrink-0 font-medium tabular-nums text-ink">
                  <span className="text-brand">{String(active + 1).padStart(2, "0")}</span>
                  <span className="text-muted"> / {String(modules.length).padStart(2, "0")}</span>
                </p>
              </div>
            </div>
          </div>
          <ol className="mt-5 grid gap-1" aria-label="Services on this page">
            {modules.map((m, i) => (
              <li key={m.id}>
                <a
                  href={`#${m.id}`}
                  className={cn(
                    "flex items-center gap-4 py-1.5 text-[0.92rem] transition-colors",
                    i === active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <span className={cn("h-px transition-all duration-500", i === active ? "w-10 bg-brand" : "w-5 bg-ink/25")} />
                  {m.short}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Scrolling ruler + stations */}
      <div ref={listRef} className="relative pl-[64px] sm:pl-[92px]">
        <div aria-hidden className="absolute bottom-0 left-0 top-0 w-11 sm:w-14">
          {/* scale-rule ticks: minor every 14px, major every 70px */}
          <div className="absolute inset-y-0 right-1/2 mr-[3px] w-[8px] bg-[repeating-linear-gradient(to_bottom,rgb(16_36_46/0.2)_0_1px,transparent_1px_14px)]" />
          <div className="absolute inset-y-0 right-1/2 mr-[3px] w-[16px] bg-[repeating-linear-gradient(to_bottom,rgb(16_36_46/0.32)_0_1px,transparent_1px_70px)]" />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/15" />
          <motion.div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 origin-top rounded-full bg-brand" style={{ scaleY: fill }} />
        </div>

        {modules.map((m, i) => (
          <Station key={m.id} m={m} i={i} reached={i <= active} isActive={i === active} onActive={() => setActive(i)} discussLabel={discussLabel} />
        ))}
      </div>
    </div>
  );
}

function Station({
  m,
  i,
  reached,
  isActive,
  onActive,
  discussLabel,
}: {
  m: ServiceModule;
  i: number;
  reached: boolean;
  isActive: boolean;
  onActive: () => void;
  discussLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -50% 0px" });
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <article ref={ref} id={m.id} className="relative scroll-mt-32 pb-24 last:pb-4 sm:pb-32" aria-labelledby={`${m.id}-title`}>
      <span
        aria-hidden
        className={cn(
          "absolute -left-[64px] top-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-paper text-[0.9rem] font-medium tabular-nums transition-all duration-500 sm:-left-[92px] sm:h-14 sm:w-14 sm:text-base",
          reached ? "text-brand shadow-[inset_0_0_0_1.5px_var(--color-brand)]" : "text-muted shadow-[inset_0_0_0_1px_rgb(16_36_46/0.18)]",
        )}
      >
        {String(i + 1).padStart(2, "0")}
      </span>

      <h3
        id={`${m.id}-title`}
        className={cn(
          "text-[clamp(1.85rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] transition-colors duration-500",
          isActive ? "!text-brand" : "",
        )}
      >
        {m.title}
      </h3>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="lead mt-6 max-w-2xl"
      >
        {m.intro}
      </motion.p>

      {/* Mobile visual */}
      <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[22px] bg-paper-2 lg:hidden">
        <Image src={m.image} alt={m.imageAlt} fill sizes="100vw" className="object-cover" />
      </div>

      <p className="eyebrow mt-12 !text-[0.72rem]">Key deliverables</p>
      <ul className="mt-6 grid gap-x-12 sm:grid-cols-2">
        {m.items.map((it, k) => (
          <motion.li
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ delay: (k % 2) * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-line py-6"
          >
            <p className="flex gap-3 text-[1.05rem] font-medium leading-snug text-ink">
              <span className="mt-[0.7em] h-px w-4 shrink-0 bg-brand" aria-hidden />
              {it.title}
            </p>
            <p className="mt-2.5 pl-7 text-[0.95rem] leading-relaxed text-muted">{it.text}</p>
          </motion.li>
        ))}
      </ul>

      <Link href={routes.contact} className="link-underline mt-8 text-[1rem]">
        {discussLabel} {m.short.toLowerCase()} <ArrowUpRight className="h-4 w-4 text-brand" />
      </Link>
    </article>
  );
}
