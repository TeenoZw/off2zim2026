import { headers } from "next/headers";
import RegisterPageClient from "@/components/auth/RegisterPageClient";
import { resolveAppSurface } from "@/lib/app-surface";

export default async function RegisterPage() {
  const headerStore = await headers();
  const surfaceHeader = headerStore.get("x-off2zim-surface");
  const host = headerStore.get("host");
  const surface = surfaceHeader
    ? resolveAppSurface(surfaceHeader)
    : resolveAppSurface(host, "/register");

  return <RegisterPageClient surface={surface} />;
}
