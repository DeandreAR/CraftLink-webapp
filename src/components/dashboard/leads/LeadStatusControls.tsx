"use client";

import type { LeadDelayStatus } from "@/domain/lead";
import { LEAD_DELAY_STATUSES } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import { delayStatusBadgeClass } from "@/components/dashboard/leads/leadsViewShared";

type LeadStatusBadgeProps = {
  status: LeadDelayStatus;
  copy: DashboardDictionary;
  /** Libellé court affiché dans le badge */
  short?: boolean;
};

export function LeadStatusBadge({ status, copy, short = true }: LeadStatusBadgeProps) {
  const l = copy.leads;
  const label = short ? l.delayStatus[status] : l.delayStatus[status];
  const hint = l.delayStatusHints[status];

  return (
    <span
      title={hint}
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${delayStatusBadgeClass(status)}`}
    >
      {label}
    </span>
  );
}

type LeadStatusSelectProps = {
  value: LeadDelayStatus;
  onChange: (status: LeadDelayStatus) => void;
  copy: DashboardDictionary;
  disabled?: boolean;
  className?: string;
};

export function LeadStatusSelect({
  value,
  onChange,
  copy,
  disabled = false,
  className = "",
}: LeadStatusSelectProps) {
  const l = copy.leads;

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as LeadDelayStatus)}
      title={l.delayStatusHints[value]}
      className={`rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-900 outline-none focus:border-black ${className}`}
      aria-label={l.columns.status}
    >
      {LEAD_DELAY_STATUSES.map((status) => (
        <option key={status} value={status} title={l.delayStatusHints[status]}>
          {l.delayStatus[status]}
        </option>
      ))}
    </select>
  );
}

type LeadStatusLegendProps = {
  copy: DashboardDictionary;
};

export function LeadStatusLegend({ copy }: LeadStatusLegendProps) {
  const l = copy.leads;

  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
        {l.statusLegendTitle}
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {LEAD_DELAY_STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-1.5 text-xs text-neutral-700">
            <LeadStatusBadge status={status} copy={copy} />
            <span className="hidden text-neutral-500 sm:inline">{l.delayStatusHints[status]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
