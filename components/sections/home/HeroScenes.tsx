"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CloudMoonRain, CloudSunRain, MapPin, Moon, Sun } from "lucide-react";
import { DepthScene } from "@/components/three/DepthScene";
import { heroMedia, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Plays in this order so each step changes one thing (weather, then time of day). */
const scenes = [
  { id: "morning", label: "Morning", icon: Sun, night: 0, rain: 0 },
  { id: "morning-rain", label: "Rain", icon: CloudSunRain, night: 0, rain: 1 },
  { id: "night-rain", label: "Night rain", icon: CloudMoonRain, night: 1, rain: 1 },
  { id: "night", label: "Night", icon: Moon, night: 1, rain: 0 },
] as const;

const HOLD = 9000; // ms per scene (includes the ~2.5 s cross-fade)
const RESUME_AFTER = 20000; // auto-play resumes this long after a manual choice

export function HeroScenes() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setI((v) => (v + 1) % scenes.length), HOLD);
    return () => clearTimeout(id);
  }, [i, auto]);

  useEffect(() => () => {
    if (resume.current) clearTimeout(resume.current);
  }, []);

  const choose = (k: number) => {
    setI(k);
    setAuto(false);
    if (resume.current) clearTimeout(resume.current);
    resume.current = setTimeout(() => setAuto(true), RESUME_AFTER);
  };

  const s = scenes[i];
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative">
      <DepthScene
        src={mediaUrl(heroMedia.file)}
        depthSrc={mediaUrl(heroMedia.depth)}
        maskSrc={mediaUrl(heroMedia.mask)}
        night={s.night}
        rain={s.rain}
        alt={heroMedia.alt}
        focalX={0.52}
        focalY={0.5}
        priority
        className="aspect-[4/5] w-full rounded-[24px] sm:aspect-[5/4] lg:aspect-auto lg:h-[600px]"
      />

      {/* Scene switcher */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease }}
        className="absolute left-3 right-3 top-3 flex justify-end sm:left-auto sm:right-4 sm:top-4"
      >
        <div role="group" aria-label="Scene" className="glass glass-pill flex w-full items-center justify-between gap-0.5 p-1 sm:w-auto">
          {scenes.map((sc, k) => {
            const active = k === i;
            return (
              <button
                key={sc.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(k)}
                className={cn(
                  "t-xs relative flex h-9 flex-1 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-2.5 transition-colors sm:flex-none sm:px-3",
                  active ? "text-white" : "text-ink-2 hover:text-ink",
                )}
              >
                {active && <motion.span layoutId="scene-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                {active && auto && (
                  <motion.span
                    key={`p-${i}`}
                    className="absolute inset-x-3 bottom-1 h-[2px] origin-left rounded-full bg-white/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: HOLD / 1000, ease: "linear" }}
                  />
                )}
                <sc.icon className="relative hidden h-3.5 w-3.5 sm:block" strokeWidth={1.9} aria-hidden />
                <span className="relative">{sc.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease }}
        className="pointer-events-none absolute bottom-4 left-4 sm:bottom-5 sm:left-5"
      >
        <div className="glass glass-pill flex items-center gap-2.5 py-2 pl-2.5 pr-4">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white" aria-hidden>
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <span className="t-xs leading-tight">
            <span className="block font-medium text-ink">Marina residences</span>
            <span className="block text-muted" aria-live="polite">Mixed-use · {s.label === "Rain" ? "Morning rain" : s.label}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
