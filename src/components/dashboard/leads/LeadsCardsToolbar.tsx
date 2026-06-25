"use client";

import { FaArrowDown, FaArrowUp, FaSort } from "react-icons/fa6";
import type { DashboardDictionary } from "@/i18n/types";
import type { LeadSortKey, LeadSortState } from "@/lib/leads/sortLeads";
import { toggleLeadSort } from "@/lib/leads/sortLeads";

type LeadsCardsToolbarProps = {
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
  archivedCount: number;
  copy: DashboardDictionary;
};

const SORT_KEYS: LeadSortKey[] = ["id", "date", "name", "delay", "calendar", "contactStatus"];

export function LeadsCardsToolbar({
  sort,
  onSortChange,
  showArchived,
  onShowArchivedChange,
  archivedCount,
  copy,
}: LeadsCardsToolbarProps) {
  const s = copy.leads.sort;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
        {s.label}
      </span>
      {SORT_KEYS.map((key) => {
        const active = sort.key === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSortChange(toggleLeadSort(sort, key))}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
              active
                ? "bg-black text-white"
                : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:ring-neutral-300"
            }`}
          >
            {s[key]}
            {active ? (
              sort.direction === "asc" ? (
                <FaArrowUp className="h-2.5 w-2.5" aria-hidden />
              ) : (
                <FaArrowDown className="h-2.5 w-2.5" aria-hidden />
              )
            ) : (
              <FaSort className="h-2.5 w-2.5 opacity-40" aria-hidden />
            )}
          </button>
        );
      })}
      {archivedCount > 0 ? (
        <button
          type="button"
          onClick={() => onShowArchivedChange(!showArchived)}
          className={`ml-auto text-xs font-semibold transition ${
            showArchived ? "text-black underline" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {showArchived ? s.hideArchived : s.showArchived.replace("{count}", String(archivedCount))}
        </button>
      ) : null}
    </div>
  );
}
