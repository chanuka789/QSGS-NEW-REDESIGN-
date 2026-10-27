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
      <ul className="border-t border-ink">
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
            <Link href={s.href} className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 py-8 sm:gap-x-10 sm:py-10 lg:grid-cols-[80px_1.1fr_1fr_auto] lg:items-center">
              <span className="num pt-2 lg:pt-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(1.6rem,3.4vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink transition-transform duration-700 ease-[var(--ease-liquid)] group-hover:translate-x-2">
                {s.cardTitle}
              </span>
              <span className="col-start-2 row-start-2 mt-3 max-w-md text-[1rem] leading-relaxed text-muted lg:col-start-3 lg:row-start-1 lg:mt-0">
                {s.cardText}
              </span>
              <span className="col-start-3 row-start-1 grid h-12 w-12 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgb(16_36_46/0.2)] transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper group-hover:shadow-none lg:col-start-4 lg:h-14 lg:w-14">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* Cursor-following preview (desktop) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[260px] w-[200px] lg:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-55%" }}
      >
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key={hover}
              className="absolute inset-0 overflow-hidden rounded-[20px] shadow-[0_30px_60px_-30px_rgba(16,36,46,0.5)]"
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
