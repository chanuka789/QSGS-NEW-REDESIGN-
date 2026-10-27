import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans/opsz.css";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Ambient } from "@/components/layout/Ambient";
import { GlassFilters } from "@/components/glass/GlassFilters";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import { SITE_URL, company } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Quantity Surveying Global Solutions | Expert Taking-Off & BOQ Services",
    template: "%s | Quantity Surveying Global Solutions",
  },
  description:
    "Your trusted partner for comprehensive quantity surveying services, including precise cost estimation, 2D and 3D take-off services, and detailed BOQ preparation.",
  applicationName: company.name,
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  category: "Construction",
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/logo-mark.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: { "color-scheme": "only light" },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ed",
  colorScheme: "only light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: "only light" }}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-brand focus:shadow-lg"
        >
          Skip to content
        </a>
        <GlassFilters />
        <Ambient />
        <Providers>
          <Header />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
        </Providers>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
