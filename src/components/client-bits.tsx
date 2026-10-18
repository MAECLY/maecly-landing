"use client";

import Lenis from "lenis";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { locales, type Locale } from "@/i18n/config";

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------ Lenis */
export function SmoothScroll() {
  useEffect(() => {
    if (reduceMotion()) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.12 });
    return () => lenis.destroy();
  }, []);
  return null;
}

/* ------------------------------------------------------------ theme */
const THEME_KEY = "maecly-theme";

export function ThemeToggle({ label, lightLabel, darkLabel }: { label: string; lightLabel: string; darkLabel: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const explicit = root.dataset.theme;
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    // Sync with the theme the inline head script already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(explicit === "light" || explicit === "dark" ? explicit : sys);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage can be blocked; the choice still applies to this page */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={theme === "dark" ? lightLabel : darkLabel}
      className="grid size-9 place-items-center rounded-lg border border-line text-fg transition-colors hover:border-line-strong"
    >
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
        <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.5h3a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H8Z" fill="currentColor" />
      </svg>
    </button>
  );
}

/** Applies a stored theme before first paint (rendered in <head>). */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;

/* ------------------------------------------------------------ language */
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() || `/${lang}`;
  return (
    <nav aria-label={label} className="flex items-center rounded-lg border border-line p-0.5 font-mono text-xs">
      {locales.map((l) => {
        const href = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${l}`);
        const active = l === lang;
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-2 py-1 uppercase transition-colors ${
              active ? "bg-accent text-on-accent" : "text-muted hover:text-fg"
            }`}
          >
            {l}
          </Link>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------ hero glow */
/** Lights the cell grid under the pointer. Writes CSS vars, no re-renders. */
export function HeroGlow({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || reduceMotion() || !window.matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.style.setProperty("--glow", "1");
      });
    };
    const leave = () => el.style.setProperty("--glow", "0");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [targetId]);
  return null;
}

/* ------------------------------------------------------------ copy */
export function CopyButton({
  value,
  label,
  copied,
  hint = "",
  className = "",
  children,
}: {
  value: string;
  label: string;
  copied: string;
  /** Visible text before copying (e.g. "Copy"); replaced by `copied` after. */
  hint?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked; select the text as a fallback.
      const range = document.createRange();
      const node = document.querySelector(`[data-copy-value="${CSS.escape(value)}"]`);
      if (node) {
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1600);
  };

  return (
    <button type="button" onClick={copy} aria-label={label} className={className}>
      {children ?? <span data-copy-value={value}>{value}</span>}
      <span aria-live="polite" className="font-mono text-[11px] uppercase tracking-wider text-muted">
        {done ? copied : hint}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------ fold */
/** Sets data-folded on its child mark once it scrolls into view. */
export function FoldOnView({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mark = el.querySelector<HTMLElement>(".mark-fold");
    if (!mark) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        mark.dataset.folded = entry.isIntersecting ? "true" : "false";
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
