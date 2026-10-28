"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { homeSegmentOrder, segmentByKey } from "@/lib/services";

/** Editorial index of client groups: number, title, short text and an arrow link. */
export function SegmentIndex() {
  const items = homeSegmentOrder.map(segmentByKey);

  return (
    <div>
      <ul className="border-t border-line">
        {items.map((s, i) => (
          <motion.li
            key={s.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line"
          >
            <Link href={s.href} className="group grid grid-cols-[40px_1fr_auto] items-start gap-x-4 py-7 sm:gap-x-8 lg:grid-cols-[56px_1fr_1fr_auto] lg:items-center lg:py-8">
              <span className="num pt-1 lg:pt-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-h3 text-ink transition-colors group-hover:text-brand">
                {s.cardTitle}
              </span>
              <span className="t-body col-start-2 row-start-2 mt-2 max-w-md lg:col-start-3 lg:row-start-1 lg:mt-0">
                {s.cardText}
              </span>
              <span className="col-start-3 row-start-1 grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line)] transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-none lg:col-start-4">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

    </div>
  );
}
