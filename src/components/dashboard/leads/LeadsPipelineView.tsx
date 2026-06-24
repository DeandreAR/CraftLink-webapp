"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { LEAD_DELAY_STATUSES } from "@/domain/lead";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";

type LeadsPipelineViewProps = LeadsViewBaseProps;

export function LeadsPipelineView(props: LeadsPipelineViewProps) {
  const { leads, copy } = props;
  const l = copy.leads;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {LEAD_DELAY_STATUSES.map((delayStatus) => {
        const columnLeads = leads.filter((lead) => lead.delayStatus === delayStatus);

        return (
          <div
            key={delayStatus}
            className="flex w-[min(100%,280px)] shrink-0 flex-col rounded-lg border border-neutral-200 bg-white"
          >
            <div className="border-b border-neutral-100 px-3 py-2.5">
              <p
                className="text-xs font-bold uppercase tracking-wide text-neutral-500"
                title={l.delayStatusHints[delayStatus]}
              >
                {l.delayStatus[delayStatus]}
              </p>
              <p className="text-lg font-bold text-black">{columnLeads.length}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 p-2">
              {columnLeads.length === 0 ? (
                <li className="px-2 py-6 text-center text-xs text-neutral-400">—</li>
              ) : (
                columnLeads.map((lead) => (
                  <li key={lead.id}>
                    <LeadCard lead={lead} {...props} compact />
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
