"use client";

import type { LeadUrgency } from "@/domain/vitrine";
import { DELAY_PILL_ORDER } from "@/lib/vitrine/captureForm";
import type { VitrineDictionary } from "@/i18n/types";

type VitrineDelaySelectProps = {
  value: LeadUrgency;
  onChange: (value: LeadUrgency) => void;
  copy: VitrineDictionary;
};

export function VitrineDelaySelect({ value, onChange, copy }: VitrineDelaySelectProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-[var(--v-text)]">
        {copy.details.delayLabel}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LeadUrgency)}
        className="mt-1.5 w-full appearance-none rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] bg-[length:1rem_1rem] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 text-sm font-medium text-[var(--v-text)] outline-none focus:border-[var(--primary-color)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        }}
      >
        {DELAY_PILL_ORDER.map((option) => (
          <option key={option} value={option}>
            {copy.form.urgencyOptions[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
