"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import type { LeadDelayStatus } from "@/domain/lead";
import { LEAD_DELAY_STATUSES } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import { delayStatusBadgeClass } from "@/components/dashboard/leads/leadsViewShared";

type LeadStatusBadgeProps = {
  status: LeadDelayStatus;
  copy: DashboardDictionary;
};

export function LeadStatusBadge({ status, copy }: LeadStatusBadgeProps) {
  const l = copy.leads;

  return (
    <span
      title={l.delayStatusHints[status]}
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${delayStatusBadgeClass(status)}`}
    >
      {l.delayStatus[status]}
    </span>
  );
}

type LeadStatusPickerProps = {
  value: LeadDelayStatus;
  onChange: (status: LeadDelayStatus) => void;
  copy: DashboardDictionary;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
};

export function LeadStatusPicker({
  value,
  onChange,
  copy,
  disabled = false,
  className = "",
  compact = false,
}: LeadStatusPickerProps) {
  const l = copy.leads;
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
        title={l.delayStatusHints[value]}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={l.columns.status}
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${delayStatusBadgeClass(value)} ${compact ? "text-[10px]" : "text-xs"}`}
      >
        {l.delayStatus[value]}
        <FaChevronDown className={`h-2.5 w-2.5 opacity-60 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 min-w-[9rem] overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {LEAD_DELAY_STATUSES.map((status) => (
            <li key={status} role="option" aria-selected={status === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-2 py-1.5 text-left text-xs font-semibold transition hover:bg-neutral-50 ${status === value ? "ring-1 ring-inset ring-neutral-200" : ""}`}
              >
                <span className={`rounded-md px-2 py-0.5 ${delayStatusBadgeClass(status)}`}>
                  {l.delayStatus[status]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** @deprecated Utiliser LeadStatusPicker */
export function LeadStatusSelect(props: LeadStatusPickerProps) {
  return <LeadStatusPicker {...props} />;
}
