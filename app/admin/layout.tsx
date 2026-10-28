import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Dashboard | Quantity Surveying Global Solutions" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-paper-2">{children}</div>;
}
