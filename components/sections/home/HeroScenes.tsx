"use client";

import { DepthScene } from "@/components/three/DepthScene";
import { heroMedia, mediaUrl } from "@/lib/media";

/** Hero visual: morning → rain → night rain → night, looping every 30 s like a video. */
export function HeroScenes() {
  return (
    <DepthScene
      src={mediaUrl(heroMedia.file)}
      depthSrc={mediaUrl(heroMedia.depth)}
      maskSrc={mediaUrl(heroMedia.mask)}
      cycle={30}
      alt={heroMedia.alt}
      focalX={0.52}
      focalY={0.5}
      priority
      className="aspect-[4/5] w-full rounded-[24px] sm:aspect-[5/4] lg:aspect-auto lg:h-[600px]"
    />
  );
}
