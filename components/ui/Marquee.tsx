import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Seamless CSS marquee (GPU transform, pauses on hover). */
export function Marquee({ children, className, speed = 40, reverse = false }: { children: ReactNode; className?: string; speed?: number; reverse?: boolean }) {
  return (
    <div className={cn("group relative flex overflow-hidden mask-fade-x", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
