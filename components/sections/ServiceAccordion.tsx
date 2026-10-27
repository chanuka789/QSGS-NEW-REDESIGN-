"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ServiceModule } from "@/lib/services";
import { cn } from "@/lib/utils";

/** Numbered accordion: 01 Title + / − with intro, key deliverables and a link. */
export function ServiceAccordion({ items }: { items: { module: ServiceModule; href: string; linkLabel: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {items.map(({ module: m, href, linkLabel }, i) => {
        const isOpen = open === i;
        return (
          <div key={m.id} className="border-b border-line">
            <h3 className="!font-normal">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${m.id}`}
                id={`acc-btn-${m.id}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group grid w-full grid-cols-[40px_1fr_auto] items-center gap-4 py-6 text-left sm:grid-cols-[56px_1fr_auto]"
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-h3 text-ink transition-colors group-hover:text-brand">
                  {m.title}
                </span>
                <span className="relative h-5 w-5 text-brand" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-current" />
                  <span className={cn("absolute left-1/2 top-0 h-5 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300", isOpen && "scale-y-0")} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${m.id}`}
                  role="region"
                  aria-labelledby={`acc-btn-${m.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-10 pl-[56px] sm:pl-[72px]">
                    <p className="t-body max-w-2xl">{m.intro}</p>
                    <p className="eyebrow mt-8">Key deliverables</p>
                    <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {m.items.map((it) => (
                        <li key={it.title} className="t-small flex gap-3 text-ink-2">
                          <span className="mt-[0.7em] h-px w-3 shrink-0 bg-brand" aria-hidden />
                          {it.title}
                        </li>
                      ))}
                    </ul>
                    <Link href={href} className="link-underline t-small mt-8">
                      {linkLabel} <ArrowUpRight className="h-4 w-4 text-brand" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
