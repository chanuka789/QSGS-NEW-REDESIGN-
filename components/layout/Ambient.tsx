"use client";

import { motion, useScroll, useTransform } from "motion/react";

/** Fixed, very soft colour field behind the page — gives the liquid glass something to refract. */
export function Ambient() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  return (
    <div className="ambient" aria-hidden>
      <motion.div style={{ y: y1 }} className="ambient__blob left-[4%] top-[4%] h-[36vmax] w-[36vmax] bg-[radial-gradient(circle_at_center,#d7e9ef,transparent_65%)]" />
      <motion.div style={{ y: y2 }} className="ambient__blob right-[2%] top-[20%] h-[32vmax] w-[32vmax] bg-[radial-gradient(circle_at_center,#efe3cf,transparent_65%)]" />
      <motion.div style={{ y: y1 }} className="ambient__blob left-[35%] top-[62%] h-[36vmax] w-[36vmax] bg-[radial-gradient(circle_at_center,#e2e9d6,transparent_62%)]" />
      <div className="ambient__grid" />
    </div>
  );
}
