import { ShieldCheck } from "lucide-react";
import SurfaceEntryPage from "@/components/layout/SurfaceEntryPage";
import { getSurfaceHref } from "@/lib/app-surface";

export default function AdminEntryPage() {
  return (
    <SurfaceEntryPage
      eyebrow="Admin app"
      title="The admin app is the operations workspace."
      body="Use this surface to access administrator sign in and move directly into provider reviews, bookings, disputes, and platform oversight without crossing through the public site."
      icon={ShieldCheck}
      actions={[
        { label: "Admin sign in", href: getSurfaceHref("admin", "/login") },
        {
          label: "Open admin workspace",
          href: getSurfaceHref("admin", "/admin/providers"),
          variant: "secondary",
        },
      ]}
      points={[
        "Restricted admin access",
        "Provider, listing, booking, and dispute oversight",
        "Same backend and same database as every surface",
      ]}
    />
  );
}
