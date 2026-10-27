"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useSpring, type MotionValue } from "motion/react";
import { createRef, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServiceModule } from "@/lib/services";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Chapter navigator for service pages.
 * Desktop: a sticky index on the left; each chapter number has a thin progress
 * ring that fills as you read that service, and the active chapter is highlighted.
 * Mobile: a sticky row of service tabs that follows the scroll.
 */
export function ServiceTimeline({ modules, discussLabel = "Discuss" }: { modules: ServiceModule[]; discussLabel?: string }) {
  const refs = useMemo(() => modules.map(() => createRef<HTMLElement>()), [modules]);
  const [active, setActive] = useState(0);

  return (
    <div className="container-x">
      <MobileTabs modules={modules} active={active} />
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside className="hidden lg:block" aria-label="Services on this page">
          <div className="sticky top-28">
            <p className="eyebrow">On this page</p>
            <ol className="mt-5 space-y-1">
              {modules.map((m, i) => (
                <IndexRow key={m.id} m={m} i={i} active={i === active} target={refs[i]} />
              ))}
            </ol>
            <div className="mt-8 rounded-[16px] bg-brand-50 p-5">
              <p className="t-h4 text-ink">Need a quote?</p>
              <p className="t-small mt-1 text-muted">Share your drawings and we will reply with scope and timeline.</p>
              <Link href={routes.contact} className="btn btn-primary btn-sm mt-4">
                Get a quote <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        <div>
          {modules.map((m, i) => (
            <Chapter key={m.id} m={m} i={i} total={modules.length} sectionRef={refs[i]} onActive={setActive} discussLabel={discussLabel} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-line" />
      <motion.circle cx="20" cy="20" r="18" fill="none" strokeWidth="1.5" strokeLinecap="round" className={active ? "stroke-brand" : "stroke-brand/50"} style={{ pathLength: progress }} />
    </svg>
  );
}

function IndexRow({ m, i, active, target }: { m: ServiceModule; i: number; active: boolean; target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 70%", "end 45%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  return (
    <li>
      <a
        href={`#${m.id}`}
        aria-current={active ? "true" : undefined}
        className={cn("group flex items-center gap-3.5 rounded-[12px] px-2 py-2 transition-colors", active ? "bg-brand-50" : "hover:bg-paper-2")}
      >
        <span className={cn("t-xs relative grid h-10 w-10 shrink-0 place-items-center font-medium tabular-nums", active ? "text-brand" : "text-muted")}>
          <ProgressRing progress={progress} active={active} />
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className={cn("t-small leading-snug transition-colors", active ? "font-medium text-ink" : "text-muted group-hover:text-ink")}>{m.short}</span>
      </a>
    </li>
  );
}

function MobileTabs({ modules, active }: { modules: ServiceModule[]; active: number }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    if (el && bar.current) bar.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);
  return (
    <div className="sticky top-3 z-30 -mx-5 mb-8 px-3 sm:-mx-8 lg:hidden">
      <div ref={bar} className="glass glass-strong glass-pill flex gap-1 overflow-x-auto p-1.5 [scrollbar-width:none]" data-lenis-prevent-touch>
        {modules.map((m, i) => (
          <a
            key={m.id}
            data-i={i}
            href={`#${m.id}`}
            className={cn("t-xs shrink-0 rounded-full px-3.5 py-2 transition-colors", i === active ? "bg-brand text-white" : "text-ink-2")}
          >
            {String(i + 1).padStart(2, "0")} · {m.short.split(" ").slice(0, 3).join(" ")}
          </a>
        ))}
      </div>
    </div>
  );
}

function Chapter({
  m,
  i,
  total,
  sectionRef,
  onActive,
  discussLabel,
}: {
  m: ServiceModule;
  i: number;
  total: number;
  sectionRef: RefObject<HTMLElement | null>;
  onActive: (i: number) => void;
  discussLabel: string;
}) {
  const inView = useInView(sectionRef as RefObject<HTMLElement>, { margin: "-40% 0px -55% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);

  return (
    <article
      ref={sectionRef as RefObject<HTMLElement>}
      id={m.id}
      aria-labelledby={`${m.id}-title`}
      className={cn("scroll-mt-28 border-line", i > 0 && "mt-16 border-t pt-16 lg:mt-20 lg:pt-20")}
    >
      <p className="eyebrow">
        Service {String(i + 1).padStart(2, "0")} <span className="text-muted">/ {String(total).padStart(2, "0")}</span>
      </p>
      <h3 id={`${m.id}-title`} className="t-h2 mt-4 max-w-2xl">
        {m.title}
      </h3>
      <p className="t-lead mt-5 max-w-2xl">{m.intro}</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[16px] bg-paper-2"
      >
        <Image src={m.image} alt={m.imageAlt} fill sizes="(min-width:1024px) 800px, 100vw" className="object-cover" />
      </motion.div>

      <h4 className="eyebrow mt-10">What you receive</h4>
      <ul className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {m.items.map((it, k) => (
          <motion.li
            key={it.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ delay: (k % 2) * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-3.5"
          >
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand" aria-hidden>
              <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <div>
              <p className="t-h4 text-ink">{it.title}</p>
              <p className="t-small mt-1.5 text-muted">{it.text}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      <Link href={routes.contact} className="link-underline t-small mt-10">
        {discussLabel} {m.short.toLowerCase()} <ArrowUpRight className="h-4 w-4 text-brand" />
      </Link>
    </article>
  );
}
