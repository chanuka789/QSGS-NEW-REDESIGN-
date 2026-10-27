"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { BuildingView } from "./BuildingScene";

const BuildingScene = dynamic(() => import("./BuildingScene"), { ssr: false });
const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type Props =
  | { scene: "building"; view?: BuildingView; rotate?: boolean; className?: string; fallback?: ReactNode }
  | { scene: "globe"; className?: string; fallback?: ReactNode };

/**
 * Mounts a Three.js scene only when it approaches the viewport, pauses rendering
 * when it scrolls away, and shows a static fallback when WebGL is unavailable.
 */
export function LazyScene(props: Props) {
  const { className, fallback } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [webgl] = useState(() => (typeof window === "undefined" ? true : hasWebGL()));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "400px 0px" });
    const vis = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "80px 0px" });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {(!webgl || !mounted) && fallback}
      {webgl && mounted && (
        <div className="absolute inset-0 animate-[fadeIn_1.2s_var(--ease-liquid)_both]">
          {props.scene === "building" ? (
            <BuildingScene view={props.view} rotate={props.rotate} active={active} />
          ) : (
            <GlobeScene active={active} />
          )}
        </div>
      )}
    </div>
  );
}
