import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Keep the exact WordPress URL shape (trailing slash) so existing Google rankings carry over.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
  async redirects() {
    // Friendly short links and common legacy WordPress paths.
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/about", destination: "/about-us/", permanent: true },
      { source: "/services", destination: "/our-services/", permanent: true },
      { source: "/contact", destination: "/contact-us-quantity-surveying-global-solutions/", permanent: true },
      { source: "/contact-us", destination: "/contact-us-quantity-surveying-global-solutions/", permanent: true },
      { source: "/our-team", destination: "/highly-qualified-quantity-surveyors-leading-qs-outsource-company/", permanent: true },
      { source: "/team", destination: "/highly-qualified-quantity-surveyors-leading-qs-outsource-company/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/wp-admin", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
