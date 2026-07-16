"use client";

import { useState } from "react";
import { isFileDragEvent } from "@/hooks/useLeadAttachmentUpload";
import { LEAD_WORKFLOW_STATUSES } from "@/domain/lead";
import type { LeadWorkflowStatus } from "@/domain/lead";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import { LeadWorkflowBadge } from "@/components/dashboard/leads/LeadWorkflowControls";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { workflowStatusColumnClass } from "@/components/dashboard/leads/leadsViewShared";

type LeadsPipelineViewProps = LeadsViewBaseProps;

function PipelineColumn({
  workflowStatus,
  columnLeads,
  isDropTarget,
  copy,
  props,
  draggingId,
  setDraggingId,
  setDropTarget,
  handleDrop,
}: {
  workflowStatus: LeadWorkflowStatus;
  columnLeads: LeadsViewBaseProps["leads"];
  isDropTarget: boolean;
  copy: LeadsViewBaseProps["copy"];
  props: LeadsViewBaseProps;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  setDropTarget: (s: LeadWorkflowStatus | null) => void;
  handleDrop: (status: LeadWorkflowStatus) => void;
}) {
  const l = copy.leads;

  return (
    <div
      onDragOver={(event) => {
        if (isFileDragEvent(event)) return;
        event.preventDefault();
        setDropTarget(workflowStatus);
      }}
      onDragLeave={() => setDropTarget(null)}
      onDrop={(event) => {
        if (isFileDragEvent(event)) return;
        event.preventDefault();
        handleDrop(workflowStatus);
      }}
      className={`flex w-full shrink-0 flex-col rounded-2xl border bg-white shadow-[0_8px_24px_rgba(33,33,41,0.06)] transition md:w-[min(82vw,280px)] md:snap-start ${
        isDropTarget ? "border-black ring-2 ring-black/10" : "border-neutral-200"
      } ${workflowStatusColumnClass(workflowStatus)}`}
    >
      <div className="border-b border-neutral-100/80 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <LeadWorkflowBadge status={workflowStatus} copy={copy} />
          <span className="text-sm font-bold text-neutral-800">{columnLeads.length}</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-neutral-500 max-md:hidden">
          {l.workflow.hints[workflowStatus]}
        </p>
      </div>
      <ul className="flex flex-1 flex-col gap-2 p-2 max-md:grid max-md:grid-cols-2 max-md:gap-1.5 max-md:p-1.5">
        {columnLeads.length === 0 ? (
          <li
            className={`max-md:col-span-2 rounded-xl border border-dashed px-2 py-6 text-center text-xs md:py-10 ${
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
              className={`cursor-grab active:cursor-grabbing max-md:cursor-pointer ${
                draggingId === lead.id ? "opacity-40" : ""
              }`}
            >
              <div className="max-md:hidden">
                <LeadCard lead={lead} {...props} compact draggable />
              </div>
              <button
                type="button"
                onClick={() => props.onOpenDetail(lead.id)}
                className="hidden w-full rounded-lg border border-neutral-200 bg-white p-2 text-left md:hidden"
              >
                <p className="line-clamp-2 text-[11px] font-bold leading-tight text-[#212129]">
                  {lead.clientName}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-[#5b6478]">{lead.workType}</p>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function LeadsPipelineView(props: LeadsPipelineViewProps) {
  const { leads, copy, onWorkflowStatusChange } = props;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<LeadWorkflowStatus | null>(null);

  const handleDrop = (status: LeadWorkflowStatus) => {
    if (!draggingId) return;
    onWorkflowStatusChange(draggingId, status);
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="max-md:flex max-md:flex-col max-md:gap-3 md:scrollbar-soft md:flex md:snap-x md:snap-mandatory md:gap-3 md:overflow-x-auto md:pb-3">
      {LEAD_WORKFLOW_STATUSES.map((workflowStatus) => {
        const columnLeads = leads.filter((lead) => lead.workflowStatus === workflowStatus);
        const isDropTarget = dropTarget === workflowStatus;

        return (
          <PipelineColumn
            key={workflowStatus}
            workflowStatus={workflowStatus}
            columnLeads={columnLeads}
            isDropTarget={isDropTarget}
            copy={copy}
            props={props}
            draggingId={draggingId}
            setDraggingId={setDraggingId}
            setDropTarget={setDropTarget}
            handleDrop={handleDrop}
          />
        );
      })}
    </div>
  );
}
