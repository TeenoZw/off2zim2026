"use client";

import { ReactNode } from "react";

export default function AdminStatGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{children}</div>;
}
