"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to marketplace as it's our main shopping interface
    router.replace("/marketplace");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Redirecting to Marketplace...
        </h2>
        <p className="text-gray-600">
          Taking you to our main shopping platform.
        </p>
      </div>
    </div>
  );
}
