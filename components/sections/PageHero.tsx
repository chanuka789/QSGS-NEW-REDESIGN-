import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";
import type { ReactNode } from "react";

/** Inner-page hero: breadcrumb → eyebrow → title (t-display) → lead → optional image. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  children,
}: {
  crumbs: { name: string; href?: string }[];
  eyebrow?: string;
  title: string[];
  lead?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <section className="pb-4 pt-28 lg:pt-36">
      <div className="container-x">
        <nav aria-label="Breadcrumb">
          <ol className="t-xs flex flex-wrap items-center gap-1.5 text-muted">
            <li>
              <Link href="/" className="hover:text-ink">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.name} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="text-ink">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && (
          <Reveal y={10}>
            <p className="eyebrow mt-10">{eyebrow}</p>
          </Reveal>
        )}
        <SplitText as="h1" immediate delay={0.05} parts={title} className="t-display mt-4 max-w-4xl" />
        {lead && (
          <Reveal delay={0.25}>
            <p className="t-lead mt-6 max-w-2xl">{lead}</p>
          </Reveal>
        )}
        {children}
      </div>
      {image && (
        <Reveal delay={0.3} y={30} className="container-x mt-12 lg:mt-16">
          <ParallaxImage src={image} alt={imageAlt} priority className="aspect-[16/10] rounded-[16px] sm:aspect-[21/9]" sizes="(min-width:1200px) 1136px, 100vw" strength={8} />
        </Reveal>
      )}
    </section>
  );
}
