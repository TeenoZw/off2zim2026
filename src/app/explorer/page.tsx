import { Compass, MapPinned } from "lucide-react";
import SurfaceEntryPage from "@/components/layout/SurfaceEntryPage";
import { getSurfaceHref } from "@/lib/app-surface";

export default function ExplorerEntryPage() {
  return (
    <SurfaceEntryPage
      eyebrow="Explorer app"
      title="The explorer app is your customer workspace."
      body="Use this surface to sign in, manage saved places, continue trip planning, and return to your travel activity without stepping through the public landing page."
      icon={Compass}
      actions={[
        { label: "Client login", href: getSurfaceHref("explorer", "/login") },
        {
          label: "Create explorer account",
          href: getSurfaceHref("explorer", "/register"),
          variant: "secondary",
        },
        {
          label: "Open dashboard",
          href: getSurfaceHref("explorer", "/dashboard"),
          variant: "secondary",
        },
      ]}
      points={[
        "Sign in as a traveler",
        "Continue with planner and saved places",
        "Same backend and database as every Off2Zim surface",
      ]}
    />
  );
}
