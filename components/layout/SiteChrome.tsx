"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Public pages get the header and footer; the private dashboard (/admin) gets neither. */
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const admin = usePathname()?.startsWith("/admin");
  if (admin) return <main id="main">{children}</main>;
  return (
    <>
      {header}
      <main id="main" className="relative">
        {children}
      </main>
      {footer}
    </>
  );
}
