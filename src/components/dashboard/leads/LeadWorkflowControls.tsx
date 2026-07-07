"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import type { LeadWorkflowStatus } from "@/domain/lead";
import { LEAD_WORKFLOW_STATUSES } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import { workflowStatusBadgeClass } from "@/lib/leads/workflowStatus";

type LeadWorkflowBadgeProps = {
  status: LeadWorkflowStatus;
  copy: DashboardDictionary;
  compact?: boolean;
};

export function LeadWorkflowBadge({ status, copy, compact = false }: LeadWorkflowBadgeProps) {
  const label = copy.leads.workflow.labels[status];
  return (
    <span
      className={`inline-block rounded-md font-semibold ${workflowStatusBadgeClass(status)} ${
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-xs"
      }`}
    >
      {label}
    </span>
  );
}

type LeadWorkflowPickerProps = {
  value: LeadWorkflowStatus;
  onChange: (status: LeadWorkflowStatus) => void;
  copy: DashboardDictionary;
  compact?: boolean;
  className?: string;
  disabled?: boolean;
};

export function LeadWorkflowPicker({
  value,
  onChange,
  copy,
  compact = false,
  className = "",
  disabled = false,
}: LeadWorkflowPickerProps) {
  const w = copy.leads.workflow;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        title={w.hints[value]}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={copy.leads.columns.status}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 font-semibold transition hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          compact ? "min-h-9 py-1.5 text-xs" : "min-h-11 py-2.5 text-sm"
        }`}
      >
        <span className={`rounded-md px-2 py-0.5 ${workflowStatusBadgeClass(value)}`}>
          {w.labels[value]}
        </span>
        <FaChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-neutral-400 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="scrollbar-soft absolute left-0 right-0 top-full z-30 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg"
        >
          {LEAD_WORKFLOW_STATUSES.map((status) => {
            const active = status === value;
            return (
              <li key={status} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(status);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-2.5 py-2 text-left transition hover:bg-neutral-50 ${
                    active ? "bg-neutral-50" : ""
                  }`}
                >
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${workflowStatusBadgeClass(status)}`}
                  >
                    {w.labels[status]}
                  </span>
                  <span className="min-w-0 flex-1 text-[11px] leading-snug text-neutral-500">
                    {w.hints[status]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
