"use client";

import { useLenis } from "lenis/react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="inline-flex items-center gap-1.5 hover:text-brand"
    >
      Back to top <ArrowUp className="h-3.5 w-3.5" />
    </button>
  );
}
