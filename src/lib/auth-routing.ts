import type { User, UserRole } from "@/types/auth";

function getRoleFromUser(user?: Pick<User, "role"> | null): UserRole | null {
  return user?.role ?? null;
}

export function getPostAuthRoute(user?: Pick<User, "role"> | null) {
  const role = getRoleFromUser(user);

  if (role === "provider") {
    return "/provider-dashboard";
  }

  if (role === "admin") {
    return "/admin/providers";
  }

  return "/travel-guide";
}

export function getAccountRoute(user?: Pick<User, "role"> | null) {
  const role = getRoleFromUser(user);

  if (role === "provider") {
    return "/provider-dashboard";
  }

  if (role === "admin") {
    return "/admin/providers";
  }

  return "/dashboard";
}
