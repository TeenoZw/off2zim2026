"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Store } from "lucide-react";

export default function ShopPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/marketplace");
    }, 800);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="theme-page flex min-h-screen items-center justify-center px-4 py-10">
      <div className="theme-panel-strong w-full max-w-2xl rounded-[34px] p-8 text-center md:p-10">
        <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
          Shop
        </div>
        <Store className="mx-auto mt-5 h-10 w-10 text-[#ff7352]" />
        <h1 className="theme-heading mt-5 text-3xl font-semibold md:text-4xl">
          Taking you to the Off2Zim marketplace
        </h1>
        <p className="theme-muted mx-auto mt-4 max-w-xl text-sm leading-7 md:text-base">
          Marketplace is now the main discovery and shopping surface for stays,
          experiences, services, and trusted provider listings.
        </p>
        <Link
          href="/marketplace"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
        >
          Open marketplace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
