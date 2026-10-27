import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  children,
  size = "lg",
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
    <section className="px-5 pt-32 sm:px-8 lg:pt-44">
      <div className="mx-auto max-w-[1320px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.85rem] text-muted">
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
          <Reveal y={10} blur={false}>
            <p className="eyebrow mt-12">{eyebrow}</p>
          </Reveal>
        )}
        <SplitText
          as="h1"
          immediate
          delay={0.1}
          parts={title}
          className={cn("display mt-7 max-w-[18ch]", size === "lg" ? "text-[clamp(2.7rem,6.4vw,6rem)]" : "text-[clamp(2.4rem,5vw,4.6rem)]")}
        />
        {lead && (
          <Reveal delay={0.35} blur={false}>
            <p className="lead mt-8 max-w-2xl">{lead}</p>
          </Reveal>
        )}
        {children}
      </div>
      {image && (
        <Reveal delay={0.4} y={40} className="mx-auto mt-16 max-w-[1400px] lg:mt-24">
          <ParallaxImage src={image} alt={imageAlt} priority className="aspect-[16/10] rounded-[6px] sm:aspect-[21/9]" sizes="100vw" strength={10} />
        </Reveal>
      )}
    </section>
  );
}
