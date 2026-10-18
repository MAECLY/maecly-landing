import { NextResponse, type NextRequest } from "next/server";

/**
 * A first path segment that is not a locale (e.g. /foo, /fr) would match
 * [lang] and fail inside the root layout, which can only show Next's bare
 * 404. Rewriting it to a path no route matches serves the branded
 * global-not-found page with a 404 status instead.
 */
export function proxy(request: NextRequest) {
  return NextResponse.rewrite(new URL("/en/__not-found", request.url));
}

export const config = {
  // One segment, no file extension, not a locale and not a Next.js internal.
  matcher: ["/((?!en$|es$|_next|_vercel)[^/.]+)"],
};
