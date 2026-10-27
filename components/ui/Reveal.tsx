"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const tags = { div: motion.div, ul: motion.ul, ol: motion.ol, section: motion.section };

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: boolean; children: ReactNode };

/** Fades/rises content into view once, with a soft de-blur — the "liquid" settle. */
export function Reveal({ delay = 0, y = 28, blur = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
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
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
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
