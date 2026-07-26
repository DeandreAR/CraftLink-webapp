"use client";

import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import { delayStatusBadgeClass } from "@/components/dashboard/leads/leadsViewShared";

type LeadInboxListProps = {
  leads: DashboardLead[];
  selectedId: string | null;
  copy: DashboardDictionary;
  onSelect: (id: string) => void;
};

export function LeadInboxList({ leads, selectedId, copy, onSelect }: LeadInboxListProps) {
  const inbox = copy.inbox;
  const l = copy.leads;

  if (leads.length === 0) {
    return (
      <div className="flex min-h-[10rem] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-500 lg:min-h-[12rem] lg:p-6">
        {inbox.emptyNew}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 lg:space-y-2" role="listbox" aria-label={inbox.listAriaLabel}>
      {leads.map((lead) => {
        const isSelected = lead.id === selectedId;
        return (
          <li key={lead.id}>
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              data-active={isSelected ? "true" : undefined}
              onClick={() => onSelect(lead.id)}
              className={`db-inbox-list-item db-list-row w-full cursor-pointer px-3 py-2.5 text-left lg:px-4 lg:py-3.5 ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`truncate text-sm font-semibold lg:text-[15px] ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {lead.clientName}
                </p>
                <span
                  className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide lg:px-2 lg:text-[10px] ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {inbox.statusNew}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold lg:px-2 lg:text-[10px] ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : delayStatusBadgeClass(lead.delayStatus)
                  }`}
                >
                  {l.delayStatus[lead.delayStatus]}
                </span>
              </div>
              <p
                className={`mt-0.5 truncate text-xs font-medium lg:mt-1 lg:text-sm ${
                  isSelected ? "text-white/80" : "text-slate-500"
                }`}
              >
                {lead.workType}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
