"use client";

import type { DashboardDictionary } from "@/i18n/types";

type LeadsBulkActionsBarProps = {
  count: number;
  copy: DashboardDictionary;
  onMarkDone: () => void;
  onArchive: () => void;
  onClear: () => void;
};

export function LeadsBulkActionsBar({
  count,
  copy,
  onMarkDone,
  onArchive,
  onClear,
}: LeadsBulkActionsBarProps) {
  const b = copy.leads.bulk;

  if (count === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-slate-50 px-3 py-2.5">
      <span className="text-xs font-semibold text-slate-700">
        {b.selected.replace("{count}", String(count))}
      </span>
      <div className="ml-auto flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onMarkDone}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
        >
          {b.markDone}
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          {b.archive}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-500 transition hover:text-neutral-800"
        >
          {b.clear}
        </button>
      </div>
    </div>
  );
}
