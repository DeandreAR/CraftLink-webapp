"use client";

import type { LeadUrgency } from "@/domain/vitrine";
import { DELAY_PILL_ORDER } from "@/lib/vitrine/captureForm";
import type { VitrineDictionary } from "@/i18n/types";

type VitrineDelayPillsProps = {
  value: LeadUrgency;
  onChange: (value: LeadUrgency) => void;
  copy: VitrineDictionary;
};

export function VitrineDelayPills({ value, onChange, copy }: VitrineDelayPillsProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--v-text)]">
        {copy.details.delayLabel}
      </p>
      <ul className="mt-2.5 space-y-2">
        {DELAY_PILL_ORDER.map((option) => {
          const selected = value === option;
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => onChange(option)}
                className={`w-full rounded-2xl border-2 px-3.5 py-3 text-left text-xs font-semibold leading-snug transition sm:text-[13px] ${
                  selected
                    ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] text-[var(--v-text)]"
                    : "border-[var(--v-muted)]/20 bg-[var(--v-surface)] text-[var(--v-muted)] hover:border-[var(--primary-color)]/40"
                }`}
              >
                {copy.form.urgencyOptions[option]}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
