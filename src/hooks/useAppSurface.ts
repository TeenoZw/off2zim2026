"use client";

import { useEffect, useState } from "react";
import { AppSurface, resolveAppSurface } from "@/lib/app-surface";

export function useAppSurface() {
  const [surface, setSurface] = useState<AppSurface>("public");

  useEffect(() => {
    setSurface(resolveAppSurface(window.location.hostname, window.location.pathname));
  }, []);

  return surface;
}
