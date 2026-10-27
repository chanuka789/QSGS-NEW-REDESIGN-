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

/** Enable SVG backdrop refraction only where it renders well and fast (desktop Chromium). */
function useLensSupport() {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isChromium = /Chrome\/\d+/.test(ua) && !/CriOS|FxiOS|EdgiOS|SamsungBrowser/.test(ua);
    const desktop = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
    if (isChromium && desktop && !reduced) document.documentElement.classList.add("supports-lens");
  }, []);
}

export function Providers({ children }: { children: ReactNode }) {
  useLensSupport();
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
      <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -100 } }}>
        <ScrollReset />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
