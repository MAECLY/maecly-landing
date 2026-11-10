"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 days ago" / "hace 3 días"; "just now" under a minute. */
export function relative(iso: string, lang: Locale, now = Date.now()): string {
  const rtf = new Intl.RelativeTimeFormat(lang === "es" ? "es" : "en", { numeric: "auto" });
  const secs = Math.round((new Date(iso).getTime() - now) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(secs) >= size) return rtf.format(Math.round(secs / size), unit);
  }
  return rtf.format(0, "minute");
}

/**
 * A <time> that the server renders with the absolute date (`fallback`), and
 * the browser turns into a relative one. The page is cached for an hour, so
 * "2 days ago" must be computed where it is read, not where it was built.
 */
export function RelTime({
  iso,
  lang,
  fallback,
  className,
}: {
  iso: string;
  lang: Locale;
  fallback: string;
  className?: string;
}) {
  const [text, setText] = useState(fallback);
  useEffect(() => {
    const tick = () => setText(relative(iso, lang));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [iso, lang]);
  return (
    <time dateTime={iso} title={fallback} className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
