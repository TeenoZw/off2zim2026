import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getSurfaceHome,
  isPathAllowedOnSurface,
  resolveAppSurface,
  stripSurfacePrefix,
} from "@/lib/app-surface";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");
  const surface = resolveAppSurface(hostname, pathname);
  const internalPath = stripSurfacePrefix(pathname);

  if (
    internalPath.startsWith("/_next") ||
    internalPath.startsWith("/icons") ||
    internalPath.startsWith("/images") ||
    internalPath.startsWith("/fonts") ||
    internalPath.startsWith("/logos") ||
    internalPath.includes(".")
  ) {
    return NextResponse.next();
  }

  if (surface === "public") {
    return NextResponse.next();
  }

  if (internalPath === "/") {
    const url = request.nextUrl.clone();
    url.pathname = getSurfaceHome(surface);

    if (pathname !== url.pathname) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-off2zim-surface", surface);
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.redirect(url);
  }

  if (!isPathAllowedOnSurface(internalPath, surface)) {
    const url = request.nextUrl.clone();
    url.pathname = getSurfaceHome(surface);

    if (pathname !== url.pathname) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-off2zim-surface", surface);
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-off2zim-surface", surface);

  if (pathname !== internalPath) {
    const url = request.nextUrl.clone();
    url.pathname = internalPath;
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
