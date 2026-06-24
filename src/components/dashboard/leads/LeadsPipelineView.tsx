"use client";

import { useState } from "react";
import { LEAD_DELAY_STATUSES } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import { LeadStatusBadge } from "@/components/dashboard/leads/LeadStatusControls";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { delayStatusColumnClass } from "@/components/dashboard/leads/leadsViewShared";

type LeadsPipelineViewProps = LeadsViewBaseProps;

export function LeadsPipelineView(props: LeadsPipelineViewProps) {
  const { leads, copy, onDelayStatusChange } = props;
  const l = copy.leads;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<LeadDelayStatus | null>(null);

  const handleDrop = (status: LeadDelayStatus) => {
    if (!draggingId) return;
    onDelayStatusChange(draggingId, status);
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:gap-3">
      {LEAD_DELAY_STATUSES.map((delayStatus) => {
        const columnLeads = leads.filter((lead) => lead.delayStatus === delayStatus);
        const isDropTarget = dropTarget === delayStatus;

        return (
          <div
            key={delayStatus}
            onDragOver={(event) => {
              event.preventDefault();
              setDropTarget(delayStatus);
            }}
            onDragLeave={() => setDropTarget((prev) => (prev === delayStatus ? null : prev))}
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(delayStatus);
            }}
            className={`flex w-[min(100%,260px)] shrink-0 flex-col rounded-lg border bg-white transition ${
              isDropTarget
                ? "border-black ring-2 ring-black/10"
                : "border-neutral-200"
            } ${delayStatusColumnClass(delayStatus)}`}
          >
            <div className="border-b border-neutral-100/80 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <LeadStatusBadge status={delayStatus} copy={copy} />
                <span className="text-sm font-bold text-neutral-800">{columnLeads.length}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-neutral-500">
                {l.delayStatusHints[delayStatus]}
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 p-2">
              {columnLeads.length === 0 ? (
                <li
                  className={`rounded-md border border-dashed px-2 py-8 text-center text-xs ${
                    isDropTarget
                      ? "border-neutral-400 text-neutral-600"
                      : "border-neutral-200 text-neutral-400"
                  }`}
                >
                  {isDropTarget ? "—" : "—"}
                </li>
              ) : (
                columnLeads.map((lead) => (
                  <li
                    key={lead.id}
                    draggable
                    onDragStart={() => setDraggingId(lead.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTarget(null);
                    }}
                    className={`cursor-grab active:cursor-grabbing ${
                      draggingId === lead.id ? "opacity-40" : ""
                    }`}
                  >
                    <LeadCard lead={lead} {...props} compact draggable />
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
