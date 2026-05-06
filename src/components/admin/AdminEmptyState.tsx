"use client";

type AdminEmptyStateProps = {
  title: string;
  body?: string;
};

export default function AdminEmptyState({ title, body }: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
      <div className="text-sm font-medium text-slate-700 dark:text-white/80">{title}</div>
      {body ? (
        <div className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-white/45">
          {body}
        </div>
      ) : null}
    </div>
  );
}
