import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHead } from "../ui";

export function Principles({ t }: { t: Dictionary }) {
  return (
    <section id="principles" aria-labelledby="principles-title" className="scroll-mt-20 bg-night py-24 text-[#eceae3] sm:py-32" data-surface="night">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="[--muted:#9ba7a8] [--accent-ink:#86c7cf]">
          <SectionHead id="principles-title" eyebrow={t.principles.eyebrow} title={t.principles.title} />
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-6">
          {t.principles.items.map((item, i) => (
            <li
              key={item.title}
              className={`principle reveal relative bg-night p-6 sm:p-8 ${i < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
              style={{ "--i": i } as CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#86c7cf]">{String(i).padStart(2, "0")}</span>
                <span className="principle-cells flex gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, k) => (
                    <span key={k} data-on={k <= i ? "true" : undefined} />
                  ))}
                </span>
              </div>
              <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-balance sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#b4bebf] text-pretty">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
