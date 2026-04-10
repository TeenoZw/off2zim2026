import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getSurfaceHome,
  isPathAllowedOnSurface,
  getSurfacePrefix,
  resolveAppSurface,
  stripSurfacePrefix,
} from "@/lib/app-surface";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");
  const surface = resolveAppSurface(hostname, pathname);
  const internalPath = stripSurfacePrefix(pathname);
  const isAuthScreen = internalPath === "/login" || internalPath === "/register";

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
    if (!isAuthScreen) {
      return NextResponse.next();
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-off2zim-auth-screen", "true");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const surfaceRoot = getSurfacePrefix(surface);

  if (pathname === surfaceRoot) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-off2zim-surface", surface);
    if (isAuthScreen) {
      requestHeaders.set("x-off2zim-auth-screen", "true");
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (internalPath === "/") {
    const url = request.nextUrl.clone();
    url.pathname = getSurfaceHome(surface);

    if (pathname !== url.pathname) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-off2zim-surface", surface);
      if (isAuthScreen) {
        requestHeaders.set("x-off2zim-auth-screen", "true");
      }
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
      if (isAuthScreen) {
        requestHeaders.set("x-off2zim-auth-screen", "true");
      }
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
  if (isAuthScreen) {
    requestHeaders.set("x-off2zim-auth-screen", "true");
  }

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
