import { cn } from "@/lib/utils";

/** Long, thin editorial arrow used in text links. */
export function ArrowLong({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 12" fill="none" aria-hidden className={cn("arrow h-3 w-14 shrink-0", className)}>
      <path d="M0 6h54M49 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
