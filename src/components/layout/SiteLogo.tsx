"use client";

import Image from "next/image";
import Link from "next/link";

interface SiteLogoProps {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function SiteLogo({
  href = "/",
  width = 128,
  height = 40,
  className = "h-10 w-auto",
  priority = false,
}: SiteLogoProps) {
  return (
    <Link href={href} className="flex items-center">
      <span
        className={`relative inline-flex shrink-0 ${className}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <Image
          src="/logos/logo.png"
          alt="Off2Zim Logo"
          fill
          className="object-contain transition-opacity duration-300 dark:opacity-0"
          sizes={`${width}px`}
          priority={priority}
        />
        <Image
          src="/logos/logo-darkmode.png"
          alt="Off2Zim Logo"
          fill
          className="object-contain opacity-0 transition-all duration-300 dark:scale-[1.98] dark:opacity-100"
          sizes={`${width}px`}
          priority={priority}
        />
      </span>
    </Link>
  );
}
