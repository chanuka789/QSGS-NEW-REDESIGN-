"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, MousePointer2 } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { DepthScene } from "@/components/three/DepthScene";
import { heroMedia, mediaUrl } from "@/lib/media";
import { routes } from "@/lib/site";

const facts = [
  { k: "20+", v: "Countries served remotely" },
  { k: "2D & 3D", v: "Take-offs from drawings & models" },
  { k: "NRM · SMM7 · CESMM4", v: "Standard methods of measurement" },
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
            parts={["Remote quantity surveying,", "measured with precision."]}
            className="t-display mt-4"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease }}
            className="t-lead mt-6 max-w-[32rem]"
          >
            Industry-leading remote quantity surveying for diverse project needs. Accurate take-offs, BOQ preparation and cost management — from anywhere in the world, without the need for on-site presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease }}
            className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
          >
            <Link href={routes.contact} className="btn btn-primary w-full justify-between sm:w-auto sm:justify-center">
              Get a quote <ArrowUpRight className="h-5 w-5" />
            </Link>
            <Link href={routes.contact} className="link-arrow">
              Schedule an online meeting <ArrowLong />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease }}
          className="relative"
        >
          <DepthScene
            src={mediaUrl(heroMedia.file)}
            depthSrc={mediaUrl(heroMedia.depth)}
            alt={heroMedia.alt}
            focalX={0.52}
            focalY={0.5}
            priority
            className="aspect-[4/5] w-full rounded-[24px] sm:aspect-[5/4] lg:aspect-auto lg:h-[600px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease }}
            className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5"
          >
            <div className="glass glass-pill flex items-center gap-2.5 py-2 pl-2.5 pr-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white" aria-hidden>
                <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="t-xs leading-tight">
                <span className="block font-medium text-ink">Marina residences</span>
                <span className="block text-muted">Mixed-use · Waterfront</span>
              </span>
            </div>
            <div className="glass glass-pill t-xs hidden items-center gap-2 px-3.5 py-2 text-ink-2 lg:flex">
              <MousePointer2 className="h-3.5 w-3.5 text-brand" strokeWidth={1.8} aria-hidden /> Move to explore
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="container-x mt-8 lg:mt-4">
        <div className="rule" />
        <dl className="grid gap-6 py-8 sm:grid-cols-3 sm:gap-8">
          {facts.map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.8, ease }}
              className="flex items-baseline gap-3"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <dt className="t-h4 text-ink">{f.k}</dt>
                <dd className="t-small mt-1 text-muted">{f.v}</dd>
              </div>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
