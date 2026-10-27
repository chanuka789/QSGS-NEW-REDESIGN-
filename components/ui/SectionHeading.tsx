import { SplitText } from "./SplitText";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Part = string | { text: string; className?: string };

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as = "h2",
  id,
  size = "lg",
  dark = false,
}: {
  eyebrow?: string;
  title: Part[];
  lead?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  size?: "md" | "lg" | "xl";
  dark?: boolean;
}) {
  const sizes = {
    md: "text-[clamp(2rem,3.6vw,3rem)]",
    lg: "text-[clamp(2.4rem,4.8vw,4.25rem)]",
    xl: "text-[clamp(2.8rem,6.4vw,6rem)]",
  };
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-4xl", className)}>
      {eyebrow && (
        <Reveal y={10} blur={false}>
          <p className={cn("eyebrow", dark && "!text-brand-200")}>{eyebrow}</p>
        </Reveal>
      )}
      <SplitText
        as={as}
        id={id}
        parts={title}
        className={cn("display", eyebrow && "mt-6", sizes[size], dark && "!text-paper")}
      />
      {lead && (
        <Reveal delay={0.15} blur={false}>
          <p className={cn("lead mt-7 max-w-2xl", align === "center" && "mx-auto", dark && "!text-white/65")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Kept for API compatibility: renders a phrase in the same voice (no decorative font). */
export const serif = (text: string): Part => text;
