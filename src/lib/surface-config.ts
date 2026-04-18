import {
  BadgeCheck,
  Building2,
  Compass,
  FileSearch,
  Flag,
  ListChecks,
  LayoutDashboard,
  MapPinned,
  MessageCircleQuestion,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { AppSurface } from "@/lib/app-surface";

type NonPublicSurface = Exclude<AppSurface, "public">;

export const portalMeta: Record<
  NonPublicSurface,
  {
    label: string;
    title: string;
    description: string;
    href: string;
    icon: typeof LayoutDashboard;
  }
> = {
  explorer: {
    label: "Explorer",
    title: "Explorer workspace",
    description: "Trips, bookings, saved places, and account activity.",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  provider: {
    label: "Service Provider",
    title: "Provider workspace",
    description: "Listings, orders, verification, and company tools.",
    href: "/provider-dashboard",
    icon: Building2,
  },
  admin: {
    label: "Admin",
    title: "Admin workspace",
    description: "Operations, onboarding, account oversight, and platform control.",
    href: "/admin/overview",
    icon: ShieldCheck,
  },
};

export type PortalLink = {
  label: string;
  href: string;
  icon?: typeof LayoutDashboard;
  section?: string;
};

export const portalLinks: Record<NonPublicSurface, PortalLink[]> = {
  explorer: [
    { label: "Workspace", href: "/dashboard" },
    { label: "Trip planner", href: "/trip-planner" },
    { label: "Bookings", href: "/checkout" },
    { label: "Shop", href: "/shop" },
    { label: "Cart", href: "/cart" },
    { label: "Profile", href: "/profile" },
  ],
  provider: [
    { label: "Dashboard", href: "/provider-dashboard" },
    { label: "Listings", href: "/provider-dashboard?tab=listings" },
    { label: "Shop Products", href: "/provider-dashboard?tab=shop" },
    { label: "Orders", href: "/provider-dashboard?tab=orders" },
    { label: "Verification", href: "/provider-dashboard?tab=verification" },
  ],
  admin: [
    {
      label: "Overview",
      href: "/admin/overview",
      icon: LayoutDashboard,
      section: "Operations",
    },
    {
      label: "Provider onboarding",
      href: "/admin/providers",
      icon: BadgeCheck,
      section: "Providers",
    },
    {
      label: "Listings",
      href: "/admin/listings",
      icon: ShoppingBag,
      section: "Providers",
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      icon: ListChecks,
      section: "Travelers",
    },
    {
      label: "Disputes",
      href: "/admin/disputes",
      icon: Flag,
      section: "Risk",
    },
    {
      label: "Compliance queue",
      href: "/admin/providers",
      icon: FileSearch,
      section: "Risk",
    },
    {
      label: "Guide applications",
      href: "/admin/guide-applications",
      icon: MessageCircleQuestion,
      section: "Community",
    },
  ],
};

export const authSurfaceCopy: Record<
  AppSurface,
  {
    login: {
      eyebrow: string;
      title: string;
      body: string;
      cardA: string;
      cardB: string;
      cardABody: string;
      cardBBody: string;
    };
    register: {
      eyebrow: string;
      title: string;
      body: string;
      cardA: string;
      cardB: string;
      cardABody: string;
      cardBBody: string;
    };
  }
> = {
  public: {
    login: {
      eyebrow: "Explorer access",
      title: "Return to the trip already taking shape.",
      body: "Saved places, itinerary flow, bookings, and account tools stay in one place.",
      cardA: "Pick up where you left off",
      cardB: "One account across the platform",
      cardABody: "Continue planning without rebuilding the journey.",
      cardBBody: "Travel tools, bookings, and partner access live behind one sign in.",
    },
    register: {
      eyebrow: "Create account",
      title: "Open the account that fits how you travel or host.",
      body: "Explorer and provider access start from one clean entry point.",
      cardA: "For explorers",
      cardB: "For providers",
      cardABody: "Save places, plan days, and manage every booking in one view.",
      cardBBody: "List your business, manage orders, and verify your profile.",
    },
  },
  explorer: {
    login: {
      eyebrow: "Explorer access",
      title: "Return to your explorer workspace.",
      body: "Trips, saved places, bookings, and route planning stay in one place.",
      cardA: "Pick up where you left off",
      cardB: "Move through the trip faster",
      cardABody: "Resume your itinerary and booking flow without losing context.",
      cardBBody: "Keep planning, favorites, and booking actions connected.",
    },
    register: {
      eyebrow: "Create explorer account",
      title: "Create your explorer workspace.",
      body: "Start saving places, building itineraries, and organizing bookings.",
      cardA: "Trip planning first",
      cardB: "One customer workspace",
      cardABody: "Destinations, stays, activities, and planning tools stay connected.",
      cardBBody: "Use one account across discovery, planning, and booking.",
    },
  },
  provider: {
    login: {
      eyebrow: "Provider access",
      title: "Return to your business workspace.",
      body: "Listings, order flow, verification, and company tools stay in one place.",
      cardA: "Manage live listings",
      cardB: "Track orders and company status",
      cardABody: "Get back to operational work without digging through the public site.",
      cardBBody: "Your same backend account powers listings, verification, and orders.",
    },
    register: {
      eyebrow: "Create provider account",
      title: "Open your service provider workspace.",
      body: "Start with a lightweight business account, then finish onboarding inside the provider tools.",
      cardA: "Create the business account first",
      cardB: "Complete verification inside the workspace",
      cardABody: "Get your business identity into the platform without a long first form.",
      cardBBody: "Verification, listings, and order tools can be completed after account creation.",
    },
  },
  admin: {
    login: {
      eyebrow: "Admin access",
      title: "Return to the operations workspace.",
      body: "Bookings, disputes, providers, and reviews stay behind one secure admin entry.",
      cardA: "Review providers and issues",
      cardB: "Oversee platform activity",
      cardABody: "Move straight into platform decisions without extra navigation.",
      cardBBody: "Use the same backend and permissions model in a cleaner operations surface.",
    },
    register: {
      eyebrow: "Admin access",
      title: "Admin accounts are provisioned centrally.",
      body: "Use your assigned operations credentials to enter the admin surface.",
      cardA: "Operations-only access",
      cardB: "Shared backend, stricter permissions",
      cardABody: "Admin accounts should be issued through secure internal workflows.",
      cardBBody: "Role separation stays cleaner when admin access is managed independently.",
    },
  },
};

export const explorerWorkspaceCards = [
  {
    title: "Profile",
    body: "Traveler details, identity, and account settings.",
    href: "/profile",
    label: "Open profile",
    icon: Compass,
    accent: "text-[#ff7352]",
  },
  {
    title: "Bookings",
    body: "Current reservations, confirmations, and next actions.",
    href: "/checkout",
    label: "View bookings",
    icon: Users,
    accent: "text-[#8cf0a1]",
  },
  {
    title: "Planner studio",
    body: "Build routes, organize days, and keep the trip moving.",
    href: "/trip-planner",
    label: "Open planner",
    icon: MapPinned,
    accent: "text-[#5aa7ff]",
  },
  {
    title: "Shop Zimbabwe",
    body: "Handcrafted goods, art, and authentic products from local vendors.",
    href: "/shop",
    label: "Browse shop",
    icon: ShoppingBag,
    accent: "text-[#8dc9ff]",
  },
];
