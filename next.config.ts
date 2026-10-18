import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Unmatched URLs get the branded 404 (the root layout is under [lang]).
    globalNotFound: true,
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // English is the default language; the root and the bare brand path
      // land on it. Language-aware redirects can come later via proxy.ts.
      { source: "/", destination: "/en", permanent: false },
      { source: "/brand", destination: "/en/brand", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/brand/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
