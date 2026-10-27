import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quantity Surveying Global Solutions",
    short_name: "QSGS",
    description: "Remote quantity surveying: take-offs, BoQ preparation and cost management.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2ed",
    theme_color: "#f4f2ed",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/logo-mark.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
