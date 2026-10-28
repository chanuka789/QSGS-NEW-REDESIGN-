"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { HeroScenes } from "./HeroScenes";
import { quoteHref, routes } from "@/lib/site";

const facts = [
  { k: "20+", v: "Countries served remotely" },
  { k: "2D & 3D", v: "Take-offs from drawings & models" },
  { k: "POMI · NRM · SMM7 · CESMM4", v: "Standard methods of measurement" },
];

export function HomeHero() {

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative pt-28 lg:pt-32">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.8 }} className="eyebrow">
            Quantity Surveying Global Solutions
          </motion.p>

          <SplitText
            as="h1"
            immediate
            delay={0.15}
            parts={["Quantity surveying services,", "measured with precision."]}
            className="t-display mt-4"
          />

          {/* CSS (not JS) fade: the paragraph is the page's largest text, so it must show
              without waiting for hydration (Largest Contentful Paint). */}
          <p className="t-lead mt-6 max-w-[32rem] animate-[fadeUp_0.9s_cubic-bezier(0.22,1,0.36,1)_0.35s_both]">
            Industry-leading remote quantity surveying for diverse project needs. Accurate take-offs, BOQ preparation and cost management — from anywhere in the world, without the need for on-site presence.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease }}
            className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
          >
            <Link href={quoteHref} className="btn btn-primary w-full justify-between sm:w-auto sm:justify-center">
              Get a quote <ArrowUpRight className="h-5 w-5" />
            </Link>
            <Link href={routes.contact} className="link-arrow">
              Schedule an online meeting <ArrowLong />
            </Link>
          </motion.div>
        </div>

        <div className="relative animate-[fadeUp_1.2s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
          <HeroScenes />
        </div>
      </div>

      <div className="container-x mt-8 lg:mt-4">
        <div className="rule" />
        <ul className="grid gap-6 py-8 sm:grid-cols-3 sm:gap-8">
          {facts.map((f, i) => (
            <motion.li
              key={f.k}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.8, ease }}
              className="flex items-baseline gap-3"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="t-h4 text-ink">{f.k}</p>
                <p className="t-small mt-1 text-muted">{f.v}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
