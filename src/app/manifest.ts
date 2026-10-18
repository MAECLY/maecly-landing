import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAECLY",
    short_name: "MAECLY",
    description: "Software that doesn't lie. Local-first tools made in Quito, Ecuador.",
    start_url: "/en",
    display: "browser",
    background_color: "#FAF9F6",
    theme_color: "#0B3D45",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/brand/symbol.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
