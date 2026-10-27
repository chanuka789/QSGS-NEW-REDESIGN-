import { LOGO_FULL, LOGO_MARK } from "@/lib/logo-paths";
import { cn } from "@/lib/utils";

type Props = { className?: string; title?: string };

/** Full horizontal logo (mark + wordmark). Colour follows `currentColor`. */
export function Logo({ className, title = "Quantity Surveying Global Solutions" }: Props) {
  return (
    <svg viewBox={LOGO_FULL.viewBox} className={cn("block", className)} role="img" aria-label={title}>
      <path d={LOGO_FULL.d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function LogoMark({ className, title }: Props) {
  return (
    <svg viewBox={LOGO_MARK.viewBox} className={cn("block", className)} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={LOGO_MARK.d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
