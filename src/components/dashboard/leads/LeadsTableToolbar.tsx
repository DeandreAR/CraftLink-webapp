"use client";

import type { DashboardDictionary } from "@/i18n/types";
import type { LeadTableFilter } from "@/lib/leads/filterLeads";

type LeadsTableToolbarProps = {
  filter: LeadTableFilter;
  onFilterChange: (filter: LeadTableFilter) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
  archivedCount: number;
  copy: DashboardDictionary;
};

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none ring-0 focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LeadsTableToolbar({
  filter,
  onFilterChange,
  showArchived,
  onShowArchivedChange,
  archivedCount,
  copy,
}: LeadsTableToolbarProps) {
  const f = copy.leads.filter;
  const s = copy.leads.sort;

  return (
    <div className="mb-2 flex flex-wrap items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
        {f.label}
      </span>
      <FilterSelect
        label={f.calendar}
        value={filter.calendar}
        onChange={(calendar) => onFilterChange({ ...filter, calendar })}
        options={[
          { value: "all", label: f.all },
          { value: "scheduled", label: f.scheduled },
          { value: "unscheduled", label: f.unscheduled },
        ]}
      />
      <FilterSelect
        label={f.contact}
        value={filter.contact}
        onChange={(contact) => onFilterChange({ ...filter, contact })}
        options={[
          { value: "all", label: f.all },
          { value: "pending", label: f.pending },
          { value: "contacted", label: f.contacted },
        ]}
      />
      {archivedCount > 0 ? (
        <button
          type="button"
          onClick={() => onShowArchivedChange(!showArchived)}
          className={`ml-auto text-xs font-semibold transition ${
            showArchived ? "text-black underline" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {showArchived ? s.hideArchived : s.showArchived.replace("{count}", String(archivedCount))}
        </button>
      ) : null}
    </div>
  );
}
