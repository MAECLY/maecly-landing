import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { themeScript } from "@/components/client-bits";
import { NotFoundBody } from "@/components/not-found-body";
import "./globals.css";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page not found · MAECLY",
  description: "This page does not exist. Go back to the MAECLY home page.",
};

/** Unmatched URLs (e.g. /foo, /en/foo, /fr) skip the [lang] layout and land here. */
export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${inter.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-svh">
        <main id="main">
          <NotFoundBody />
        </main>
      </body>
    </html>
  );
}
