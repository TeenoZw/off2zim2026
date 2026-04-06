export type AppSurface = "public" | "explorer" | "provider" | "admin";

function normalizeHost(hostname: string | null | undefined) {
  return (hostname || "").toLowerCase().split(":")[0];
}

export function resolveAppSurface(hostname: string | null | undefined): AppSurface {
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

export function getSurfaceHome(surface: AppSurface) {
  switch (surface) {
    case "admin":
      return "/admin/providers";
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
    return "/provider-dashboard";
  }

  if (role === "admin") {
    return "/admin/providers";
  }

  if (surface === "provider") {
    return "/provider-dashboard";
  }

  if (surface === "admin") {
    return "/admin/providers";
  }

  if (surface === "explorer") {
    return "/dashboard";
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

  if (!baseUrl) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const isLocalHost =
    baseUrl.hostname === "localhost" ||
    baseUrl.hostname === "127.0.0.1" ||
    baseUrl.hostname.endsWith(".localhost");

  if (surface === "public") {
    return `${baseUrl.origin}${normalizedPath}`;
  }

  if (isLocalHost) {
    return normalizedPath;
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
