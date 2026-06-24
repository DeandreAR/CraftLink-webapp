"use client";

import type { LeadWorkflowStatus } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";

type LeadWorkflowActionsProps = {
  workflowStatus: LeadWorkflowStatus;
  copy: DashboardDictionary;
  onMarkDone: () => void;
  onMarkArchived: () => void;
  onReactivate: () => void;
  compact?: boolean;
};

export function LeadWorkflowActions({
  workflowStatus,
  copy,
  onMarkDone,
  onMarkArchived,
  onReactivate,
  compact = false,
}: LeadWorkflowActionsProps) {
  const w = copy.leads.workflow;

  const btnClass = compact
    ? "rounded-md border px-2 py-1 text-[10px] font-semibold transition"
    : "rounded-lg border px-3 py-2 text-xs font-semibold transition";

  if (workflowStatus === "archived") {
    return (
      <button
        type="button"
        onClick={onReactivate}
        className={`${btnClass} border-neutral-300 text-neutral-700 hover:bg-neutral-50`}
      >
        {w.reactivate}
      </button>
    );
  }

  if (workflowStatus === "done") {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onReactivate}
          className={`${btnClass} border-neutral-300 text-neutral-700 hover:bg-neutral-50`}
        >
          {w.reactivate}
        </button>
        <button
          type="button"
          onClick={onMarkArchived}
          className={`${btnClass} border-neutral-300 text-neutral-600 hover:bg-neutral-50`}
        >
          {w.archive}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onMarkDone}
        className={`${btnClass} border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100`}
      >
        {w.markDone}
      </button>
      <button
        type="button"
        onClick={onMarkArchived}
        className={`${btnClass} border-neutral-300 text-neutral-600 hover:bg-neutral-50`}
      >
        {w.archive}
      </button>
    </div>
  );
}
