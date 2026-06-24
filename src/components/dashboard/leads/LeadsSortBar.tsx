"use client";

import type { LeadSortKey } from "@/lib/leads/sortLeads";
import type { DashboardDictionary } from "@/i18n/types";

type LeadsSortBarProps = {
  sortKey: LeadSortKey;
  onSortChange: (key: LeadSortKey) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
  archivedCount: number;
  copy: DashboardDictionary;
};

const SORT_KEYS: LeadSortKey[] = ["date", "name", "status"];

export function LeadsSortBar({
  sortKey,
  onSortChange,
  showArchived,
  onShowArchivedChange,
  archivedCount,
  copy,
}: LeadsSortBarProps) {
  const s = copy.leads.sort;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-neutral-500">{s.label}</span>
      <div className="flex flex-wrap gap-1">
        {SORT_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSortChange(key)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              sortKey === key
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {s[key]}
          </button>
        ))}
      </div>
      {archivedCount > 0 ? (
        <button
          type="button"
          onClick={() => onShowArchivedChange(!showArchived)}
          className={`ml-auto rounded-md px-2.5 py-1 text-xs font-semibold transition ${
            showArchived
              ? "bg-neutral-800 text-white"
              : "border border-neutral-200 text-neutral-600 hover:border-neutral-400"
          }`}
        >
          {showArchived ? s.hideArchived : s.showArchived.replace("{count}", String(archivedCount))}
        </button>
      ) : null}
    </div>
  );
}
