"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
      <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -100 } }}>
        <ScrollReset />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
