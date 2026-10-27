"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { homeSegmentOrder, segmentByKey } from "@/lib/services";

/** Editorial index of client groups. On desktop a preview image follows the cursor. */
export function SegmentIndex() {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const items = homeSegmentOrder.map(segmentByKey);

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !wrap.current) return;
        const r = wrap.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setHover(null)}
    >
      <ul className="border-t border-line">
        {items.map((s, i) => (
          <motion.li
            key={s.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line"
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
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

      {/* Cursor-following preview (desktop) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[220px] w-[170px] lg:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-55%" }}
      >
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key={hover}
              className="absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_16px_40px_-20px_rgba(17,28,36,0.35)]"
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <Image src={items[hover].heroImage} alt="" fill sizes="200px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
