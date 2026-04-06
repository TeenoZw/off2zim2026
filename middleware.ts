import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getSurfaceHome,
  isPathAllowedOnSurface,
  resolveAppSurface,
} from "@/lib/app-surface";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");
  const surface = resolveAppSurface(hostname);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/logos") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (surface === "public") {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = getSurfaceHome(surface);
    return NextResponse.redirect(url);
  }

  if (!isPathAllowedOnSurface(pathname, surface)) {
    const url = request.nextUrl.clone();
    url.pathname = getSurfaceHome(surface);
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-off2zim-surface", surface);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
