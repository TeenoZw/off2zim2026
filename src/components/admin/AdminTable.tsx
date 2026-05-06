"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (item: T) => ReactNode;
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyState?: ReactNode;
  className?: string;
};

export default function AdminTable<T>({
  columns,
  rows,
  rowKey,
  emptyState,
  className,
}: AdminTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
          <thead className="bg-slate-50 dark:bg-white/[0.02]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/35",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-sm text-slate-500 dark:text-white/45"
                >
                  {emptyState || "No records found."}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="align-top">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-sm text-slate-700 dark:text-white/80",
                        column.className
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
