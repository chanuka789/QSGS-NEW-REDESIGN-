"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const tags = { div: motion.div, ul: motion.ul, ol: motion.ol, section: motion.section };

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; children: ReactNode };

/** Fades and rises content into view once (transform + opacity only, GPU-friendly). */
export function Reveal({ delay = 0, y = 20, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Staggered children reveal. */
export function Stagger({ children, className, gap = 0.08, as = "div" }: { children: ReactNode; className?: string; gap?: number; as?: keyof typeof tags }) {
  const M = tags[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </M>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StaggerItem({ children, className, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function StaggerLi({ children, className, ...rest }: HTMLMotionProps<"li">) {
  return (
    <motion.li variants={staggerItem} className={className} {...rest}>
      {children}
    </motion.li>
  );
}
