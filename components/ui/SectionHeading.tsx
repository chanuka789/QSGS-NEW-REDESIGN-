import { SplitText } from "./SplitText";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Part = string | { text: string; className?: string };

/**
 * Standard section header: eyebrow → title (t-h2) → optional lead.
 * Same spacing and sizes on every page.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as = "h2",
  id,
  invert = false,
}: {
  eyebrow?: string;
  title: Part[];
  lead?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  invert?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={10}>
          <p className={cn("eyebrow", invert && "!text-white/70")}>{eyebrow}</p>
        </Reveal>
      )}
      <SplitText as={as} id={id} parts={title} className={cn("t-h2", eyebrow && "mt-4", invert && "!text-white")} />
      {lead && (
        <Reveal delay={0.1}>
          <p className={cn("t-lead mt-5 max-w-2xl", align === "center" && "mx-auto", invert && "!text-white/75")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Kept for API compatibility: renders the phrase in the same voice. */
export const serif = (text: string): Part => text;
