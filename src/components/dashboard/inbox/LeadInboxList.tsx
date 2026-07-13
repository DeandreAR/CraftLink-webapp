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
      <div className="flex min-h-[12rem] items-center justify-center rounded-[1.25rem] border border-dashed border-[#EFA188]/35 bg-white/80 p-6 text-center text-sm text-[#5b6478]">
        {inbox.emptyNew}
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="listbox" aria-label={inbox.listAriaLabel}>
      {leads.map((lead) => {
        const isSelected = lead.id === selectedId;
        return (
          <li key={lead.id}>
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(lead.id)}
              className={`w-full cursor-pointer rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#212129] bg-[#212129] text-white shadow-[0_12px_32px_rgba(33,33,41,0.22)]"
                  : "border-transparent bg-white/90 text-[#212129] hover:border-[#EFA188]/40 hover:bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`truncate font-bold ${isSelected ? "text-white" : "text-[#212129]"}`}>
                  {lead.clientName}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${
                    isSelected ? "bg-[#EFA188] text-[#212129]" : "bg-[#EFA188] text-[#212129]"
                  }`}
                >
                  {inbox.statusNew}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : delayStatusBadgeClass(lead.delayStatus)
                  }`}
                >
                  {l.delayStatus[lead.delayStatus]}
                </span>
              </div>
              <p
                className={`mt-1 truncate text-sm font-medium ${
                  isSelected ? "text-white/85" : "text-[#5b6478]"
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
