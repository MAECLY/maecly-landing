import Link from "next/link";
import { MarkSvg } from "./mark";

/** Bilingual 404 body, shared by the in-locale and the global not-found pages. */
export function NotFoundBody() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="nf-title">
      <div className="cell-grid cell-grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center px-4 py-24 sm:px-6">
        <MarkSvg className="size-14" />
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">404</p>
        <h1 id="nf-title" className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          This cell is empty.
        </h1>
        <p className="mt-4 text-lg text-muted text-pretty">
          The page you asked for is not here. <span lang="es">Esta página no existe.</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/en" hrefLang="en" className="inline-flex h-11 items-center rounded-xl bg-accent px-5 font-medium text-on-accent">
            Back to the home page
          </Link>
          <Link
            href="/es"
            hrefLang="es"
            lang="es"
            className="inline-flex h-11 items-center rounded-xl border border-line-strong bg-surface px-5 font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
