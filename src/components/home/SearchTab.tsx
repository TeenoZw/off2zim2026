"use client";

import React from "react";
import { clsx } from "clsx";

interface SearchTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SearchTab({
  label,
  isActive,
  onClick,
}: SearchTabProps) {
  return (
    <button
      onClick={onClick}
      className={clsx("search-tab", {
        active: isActive,
      })}
    >
      {label}
    </button>
  );
}
