import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageIndex } from "@/lib/page-index";

/** Ruled list of internal links: page name, one-line summary and an arrow. */
export function LinkRows({ hrefs, className }: { hrefs: string[]; className?: string }) {
  return (
    <ul className={className ?? "border-t border-line"}>
      {hrefs.map((href) => {
        const r = pageIndex[href];
        if (!r) return null;
        return (
          <li key={href} className="border-b border-line">
            <Link href={href} className="group grid gap-1 py-5 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center sm:gap-8">
              <span className="t-h4 text-ink transition-colors group-hover:text-brand">{r.label}</span>
              <span className="t-small text-muted">{r.summary}</span>
              <ArrowUpRight className="hidden h-5 w-5 text-brand sm:block" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
