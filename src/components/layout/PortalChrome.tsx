import Link from "next/link";
import { getSurfaceHref, type AppSurface } from "@/lib/app-surface";
import { portalLinks, portalMeta } from "@/lib/surface-config";
import SiteLogo from "./SiteLogo";

export default function PortalChrome({ surface }: { surface: Exclude<AppSurface, "public"> }) {
  const meta = portalMeta[surface];
  const Icon = meta.icon;
  const links = portalLinks[surface];

  return (
    <div className="sticky top-0 z-[120] border-b border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#070707]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href={getSurfaceHref(surface, meta.href)}
            className="inline-flex items-center"
          >
            <SiteLogo width={128} height={40} className="h-9 w-auto sm:h-10" priority />
          </Link>
          <div className="hidden border-l border-black/10 pl-4 dark:border-white/10 md:block">
            <div className="text-[11px] uppercase tracking-[0.28em] text-black/38 dark:text-white/35">
              {meta.label}
            </div>
            <div className="theme-heading mt-1 text-base font-semibold">{meta.title}</div>
            <div className="theme-muted text-sm">{meta.description}</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={getSurfaceHref(surface, link.href)}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-black/72 transition hover:bg-black/[0.045] hover:text-black dark:text-white/78 dark:hover:bg-white/8 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={getSurfaceHref("public", "/")}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm font-medium text-black/78 transition hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/84 dark:hover:bg-white/[0.08]"
          >
            <Icon className="h-4 w-4 text-[#ff5630]" />
            Public site
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href={getSurfaceHref(surface, meta.href)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm font-medium text-black/78 transition hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/84 dark:hover:bg-white/[0.08]"
          >
            <Icon className="h-4 w-4 text-[#ff5630]" />
            Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
