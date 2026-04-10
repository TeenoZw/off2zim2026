import { Building2 } from "lucide-react";
import SurfaceEntryPage from "@/components/layout/SurfaceEntryPage";
import { getSurfaceHref } from "@/lib/app-surface";

export default function ProviderEntryPage() {
  return (
    <SurfaceEntryPage
      eyebrow="Service provider app"
      title="The provider app is your business workspace."
      body="Use this surface to access provider sign in, complete registration, manage listings, handle orders, and move through verification in a dedicated environment."
      icon={Building2}
      actions={[
        { label: "Provider sign in", href: getSurfaceHref("provider", "/login") },
        {
          label: "Provider registration",
          href: getSurfaceHref("provider", "/register"),
          variant: "secondary",
        },
        {
          label: "Open provider dashboard",
          href: getSurfaceHref("provider", "/provider-dashboard"),
          variant: "secondary",
        },
      ]}
      points={[
        "Separate provider access",
        "Listings, orders, and verification",
        "Shared backend and unified data model",
      ]}
    />
  );
}
