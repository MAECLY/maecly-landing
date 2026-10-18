"use client";

import Lenis from "lenis";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
type ThemeChoice = "system" | "light" | "dark";
const ORDER: ThemeChoice[] = ["system", "light", "dark"];

export type ThemeLabels = {
  /** "Color theme: {current}. Switch to {next}." */
  template: string;
  system: string;
  light: string;
  dark: string;
};

/**
 * Three states: follow the system, light or dark. Each click moves to the
 * next one; "system" clears the stored override.
 */
export function ThemeToggle({ labels }: { labels: ThemeLabels }) {
  const [choice, setChoice] = useState<ThemeChoice | null>(null);

  useEffect(() => {
    const explicit = document.documentElement.dataset.theme;
    // Sync with the theme the inline head script already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(explicit === "light" || explicit === "dark" ? explicit : "system");
  }, []);

  const current = choice ?? "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const name = (c: ThemeChoice) => labels[c];
  const text = labels.template.replace("{current}", name(current)).replace("{next}", name(next));

  const cycle = () => {
    const root = document.documentElement;
    try {
      if (next === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage can be blocked; the choice still applies to this page */
    }
    if (next === "system") delete root.dataset.theme;
    else root.dataset.theme = next;
    setChoice(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={text}
      title={text}
      data-theme-choice={current}
      className="grid size-9 place-items-center rounded-lg border border-line text-fg transition-colors hover:border-line-strong"
    >
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
        <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" fill={current === "dark" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" />
        {current === "system" && <path d="M8 1.5h3a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H8Z" fill="currentColor" />}
        {current === "light" && <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" />}
      </svg>
    </button>
  );
}

/** Applies a stored theme before first paint (rendered in <head>). */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;

/* ------------------------------------------------------------ language */
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() || `/${lang}`;
  const router = useRouter();
  return (
    <nav aria-label={label} className="flex items-center overflow-hidden rounded-lg border border-line font-mono text-xs">
      {locales.map((l) => {
        const href = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${l}`);
        const active = l === lang;
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              // Keep the section the reader is on (e.g. #products).
              if (active || !window.location.hash || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              router.push(href + window.location.hash);
            }}
            className={`inline-flex min-h-9 min-w-9 items-center justify-center px-2.5 uppercase transition-colors ${
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

/* ------------------------------------------------------------ mobile menu */
/** Native <details> menu that also closes on a link click, Escape or a click outside. */
export function MobileMenu({
  label,
  navLabel,
  links,
}: {
  label: string;
  navLabel: string;
  links: Array<{ href: string; label: string }>;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = (focus: boolean) => {
      if (!el.open) return;
      el.open = false;
      if (focus) el.querySelector("summary")?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onDown = (e: PointerEvent) => {
      if (!el.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary
        className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-line [&::-webkit-details-marker]:hidden"
        aria-label={label}
      >
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
          <rect x="2" y="3" width="3" height="3" rx="0.8" fill="currentColor" />
          <rect x="6.5" y="3" width="3" height="3" rx="0.8" fill="currentColor" />
          <rect x="11" y="3" width="3" height="3" rx="0.8" fill="var(--gold)" />
          <rect x="2" y="7.5" width="3" height="3" rx="0.8" fill="currentColor" />
          <rect x="6.5" y="7.5" width="3" height="3" rx="0.8" fill="currentColor" />
          <rect x="11" y="7.5" width="3" height="3" rx="0.8" fill="currentColor" />
          <rect x="2" y="12" width="3" height="2" rx="0.8" fill="currentColor" />
          <rect x="6.5" y="12" width="3" height="2" rx="0.8" fill="currentColor" />
          <rect x="11" y="12" width="3" height="2" rx="0.8" fill="currentColor" />
        </svg>
      </summary>
      <nav aria-label={navLabel} className="absolute right-0 top-12 w-56 rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow)]">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                prefetch={false}
                onClick={() => {
                  if (ref.current) ref.current.open = false;
                }}
                className="block rounded-lg px-3 py-2.5 text-sm hover:bg-surface-2"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

/* ------------------------------------------------------------ header surface */
/**
 * Marks the header while it sits over a dark section ([data-surface=night]),
 * so it can switch to the dark tokens instead of turning a muddy grey.
 */
export function HeaderSurface({ headerId }: { headerId: string }) {
  useEffect(() => {
    const header = document.getElementById(headerId);
    if (!header) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const y = header.getBoundingClientRect().bottom / 2;
      const dark = [...document.querySelectorAll<HTMLElement>("[data-surface=night]")].some((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      if (dark) header.dataset.onDark = "true";
      else delete header.dataset.onDark;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headerId]);
  return null;
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
