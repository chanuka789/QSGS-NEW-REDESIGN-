"use client";

import { motion } from "motion/react";
import { Fragment, type ElementType } from "react";
import { cn } from "@/lib/utils";

type Part = string | { text: string; className?: string };

/**
 * Word-by-word masked reveal for headlines. Pass plain strings, or objects
 * to style a phrase (e.g. the serif accent words).
 * `immediate` (page titles, above the fold) plays as a CSS animation so the title
 * paints straight from the server HTML, without waiting for JavaScript.
 */
export function SplitText({
  parts,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
  id,
}: {
  parts: Part[];
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  id?: string;
}) {
  const words: { w: string; cls?: string }[] = [];
  parts.forEach((p) => {
    const text = typeof p === "string" ? p : p.text;
    const cls = typeof p === "string" ? undefined : p.className;
    text.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, cls }));
  });
  const label = words.map((w) => w.w).join(" ");
  if (immediate) {
    return (
      <Tag id={id} className={className} aria-label={label}>
        <span aria-hidden className="inline">
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <span
                  className={cn("inline-block animate-[wordUp_0.9s_cubic-bezier(0.22,1,0.36,1)_both]", w.cls)}
                  style={{ animationDelay: `${delay + i * 0.045}s` }}
                >
                  {w.w}
                </span>
              </span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </span>
      </Tag>
    );
  }
  return (
    <Tag id={id} className={className} aria-label={label}>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span
                className={cn("inline-block will-change-transform", w.cls)}
                variants={{
                  hidden: { y: "105%", rotate: 4, opacity: 0 },
                  show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {w.w}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
