"use client";

import { useState } from "react";
import { LEAD_WORKFLOW_STATUSES } from "@/domain/lead";
import type { LeadWorkflowStatus } from "@/domain/lead";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import { LeadWorkflowBadge } from "@/components/dashboard/leads/LeadWorkflowControls";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { workflowStatusColumnClass } from "@/components/dashboard/leads/leadsViewShared";

type LeadsPipelineViewProps = LeadsViewBaseProps;

export function LeadsPipelineView(props: LeadsPipelineViewProps) {
  const { leads, copy, onWorkflowStatusChange } = props;
  const l = copy.leads;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<LeadWorkflowStatus | null>(null);

  const handleDrop = (status: LeadWorkflowStatus) => {
    if (!draggingId) return;
    onWorkflowStatusChange(draggingId, status);
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="scrollbar-soft flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
      {LEAD_WORKFLOW_STATUSES.map((workflowStatus) => {
        const columnLeads = leads.filter((lead) => lead.workflowStatus === workflowStatus);
        const isDropTarget = dropTarget === workflowStatus;

        return (
          <div
            key={workflowStatus}
            onDragOver={(event) => {
              event.preventDefault();
              setDropTarget(workflowStatus);
            }}
            onDragLeave={() =>
              setDropTarget((prev) => (prev === workflowStatus ? null : prev))
            }
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(workflowStatus);
            }}
            className={`flex w-[min(82vw,280px)] shrink-0 snap-start flex-col rounded-2xl border bg-white transition ${
              isDropTarget
                ? "border-black ring-2 ring-black/10"
                : "border-neutral-200"
            } ${workflowStatusColumnClass(workflowStatus)}`}
          >
            <div className="border-b border-neutral-100/80 px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <LeadWorkflowBadge status={workflowStatus} copy={copy} />
                <span className="text-sm font-bold text-neutral-800">{columnLeads.length}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-neutral-500">
                {l.workflow.hints[workflowStatus]}
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 p-2">
              {columnLeads.length === 0 ? (
                <li
                  className={`rounded-xl border border-dashed px-2 py-10 text-center text-xs ${
                    isDropTarget
                      ? "border-neutral-400 text-neutral-600"
                      : "border-neutral-200 text-neutral-400"
                  }`}
                >
                  —
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
