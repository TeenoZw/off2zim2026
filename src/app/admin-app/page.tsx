import { redirect } from "next/navigation";
import { getSurfaceHref } from "@/lib/app-surface";

export default function AdminAppEntryPage() {
  redirect(getSurfaceHref("admin", "/login"));
}
