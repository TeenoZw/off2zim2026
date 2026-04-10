export type AppSurface = "public" | "explorer" | "provider" | "admin";

const surfacePathPrefixes: Record<Exclude<AppSurface, "public">, string> = {
  explorer: "/explorer",
  provider: "/sp",
  admin: "/admin-app",
};

function getForcedSurface(): AppSurface | null {
  const forced = (
    process.env.NEXT_PUBLIC_FORCE_SURFACE ||
    process.env.OFF2ZIM_FORCE_SURFACE ||
    ""
  )
    .trim()
    .toLowerCase();

  if (
    forced === "public" ||
    forced === "explorer" ||
    forced === "provider" ||
    forced === "admin"
  ) {
    return forced;
  }

  return null;
}

function normalizeHost(hostname: string | null | undefined) {
  return (hostname || "").toLowerCase().split(":")[0];
}

function normalizePath(pathname: string | null | undefined) {
  const path = pathname || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function resolveSurfaceFromPath(pathname: string | null | undefined): AppSurface {
  const path = normalizePath(pathname);

  if (path === surfacePathPrefixes.admin || path.startsWith(`${surfacePathPrefixes.admin}/`)) {
    return "admin";
  }

  if (
    path === surfacePathPrefixes.provider ||
    path.startsWith(`${surfacePathPrefixes.provider}/`)
  ) {
    return "provider";
  }

  if (
    path === surfacePathPrefixes.explorer ||
    path.startsWith(`${surfacePathPrefixes.explorer}/`)
  ) {
    return "explorer";
  }

  return "public";
}

export function resolveAppSurface(
  hostname: string | null | undefined,
  pathname?: string | null | undefined,
): AppSurface {
  if (
    hostname === "public" ||
    hostname === "explorer" ||
    hostname === "provider" ||
    hostname === "admin"
  ) {
    return hostname;
  }

  const surfaceFromPath = resolveSurfaceFromPath(pathname);

  if (surfaceFromPath !== "public") {
    return surfaceFromPath;
  }

  const forcedSurface = getForcedSurface();

  if (forcedSurface) {
    return forcedSurface;
  }

  const host = normalizeHost(hostname);

  if (
    host.startsWith("admin.") ||
    host === "admin.localhost" ||
    host === "admin.127.0.0.1" ||
    host === "admin.local"
  ) {
    return "admin";
  }

  if (
    host.startsWith("sp.") ||
    host === "sp.localhost" ||
    host === "sp.127.0.0.1" ||
    host === "sp.local"
  ) {
    return "provider";
  }

  if (
    host.startsWith("explorer.") ||
    host === "explorer.localhost" ||
    host === "explorer.127.0.0.1" ||
    host === "explorer.local"
  ) {
    return "explorer";
  }

  return "public";
}

export function stripSurfacePrefix(pathname: string) {
  const path = normalizePath(pathname);
  const surface = resolveSurfaceFromPath(path);

  if (surface === "public") {
    return path;
  }

  const prefix = surfacePathPrefixes[surface];
  const stripped = path.slice(prefix.length);
  return stripped ? normalizePath(stripped) : "/";
}

export function getSurfacePrefix(surface: Exclude<AppSurface, "public">) {
  return surfacePathPrefixes[surface];
}

export function getSurfaceHome(surface: AppSurface) {
  switch (surface) {
    case "admin":
      return "/admin/overview";
    case "provider":
      return "/provider-dashboard";
    case "explorer":
      return "/dashboard";
    default:
      return "/";
  }
}

export function getDefaultPostAuthRoute(
  surface: AppSurface,
  role?: "explorer" | "provider" | "guide" | "admin" | null,
) {
  if (role === "provider") {
    return getSurfaceHref("provider", "/provider-dashboard");
  }

  if (role === "admin") {
    return getSurfaceHref("admin", "/admin/overview");
  }

  if (surface === "provider") {
    return getSurfaceHref("provider", "/provider-dashboard");
  }

  if (surface === "admin") {
    return getSurfaceHref("admin", "/admin/overview");
  }

  if (surface === "explorer") {
    return getSurfaceHref("explorer", "/dashboard");
  }

  return "/travel-guide";
}

export function getAllowedPrefixes(surface: AppSurface) {
  switch (surface) {
    case "admin":
      return ["/admin", "/login", "/register", "/api"];
    case "provider":
      return ["/provider-dashboard", "/login", "/register", "/api"];
    case "explorer":
      return [
        "/dashboard",
        "/trip-planner",
        "/travel-guide",
        "/accommodation",
        "/activities",
        "/restaurants",
        "/events",
        "/transport",
        "/marketplace",
        "/community-guides",
        "/checkout",
        "/booking",
        "/favorites",
        "/profile",
        "/rating-system",
        "/login",
        "/register",
        "/api",
      ];
    default:
      return [];
  }
}

export function isPathAllowedOnSurface(pathname: string, surface: AppSurface) {
  if (surface === "public") {
    return true;
  }

  const allowedPrefixes = getAllowedPrefixes(surface);
  return allowedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    try {
      return new URL(window.location.origin);
    } catch {
      // fall through to configured URL
    }
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL;

  if (!configured) {
    return null;
  }

  try {
    return new URL(configured);
  } catch {
    return null;
  }
}

export function getSurfaceHref(surface: AppSurface, pathname = "/") {
  const baseUrl = getBaseUrl();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const forcedSurface = getForcedSurface();

  if (!baseUrl) {
    if (forcedSurface && (surface === forcedSurface || surface === "public")) {
      return normalizedPath;
    }

    if (surface === "public") {
      return normalizedPath;
    }

    return `${getSurfacePrefix(surface)}${normalizedPath === "/" ? "" : normalizedPath}`;
  }

  const isLocalHost =
    baseUrl.hostname === "localhost" ||
    baseUrl.hostname === "127.0.0.1" ||
    baseUrl.hostname.endsWith(".localhost");

  if (surface === "public") {
    return `${baseUrl.origin}${normalizedPath}`;
  }

  if (forcedSurface && surface === forcedSurface) {
    return normalizedPath;
  }

  if (isLocalHost) {
    return `${getSurfacePrefix(surface)}${normalizedPath === "/" ? "" : normalizedPath}`;
  }

  const hostParts = baseUrl.hostname.split(".");
  const rootDomain =
    hostParts[0] === "www" && hostParts.length > 2
      ? hostParts.slice(1).join(".")
      : baseUrl.hostname;
  const subdomain =
    surface === "provider" ? "sp" : surface === "explorer" ? "explorer" : "admin";

  return `${baseUrl.protocol}//${subdomain}.${rootDomain}${normalizedPath}`;
}
