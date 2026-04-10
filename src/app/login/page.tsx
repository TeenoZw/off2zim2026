import { headers } from "next/headers";
import LoginPageClient from "@/components/auth/LoginPageClient";
import { resolveAppSurface } from "@/lib/app-surface";

export default async function LoginPage() {
  const headerStore = await headers();
  const surfaceHeader = headerStore.get("x-off2zim-surface");
  const host = headerStore.get("host");
  const surface = surfaceHeader
    ? resolveAppSurface(surfaceHeader)
    : resolveAppSurface(host, "/login");

  return <LoginPageClient surface={surface} />;
}
