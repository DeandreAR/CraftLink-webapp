"use client";

import type { VitrineDictionary } from "@/i18n/types";

type VitrineNeedNatureSelectProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  copy: VitrineDictionary;
};

export function VitrineNeedNatureSelect({
  value,
  options,
  onChange,
  copy,
}: VitrineNeedNatureSelectProps) {
  if (options.length === 0) return null;

  return (
    <div>
      <label className="text-sm font-semibold text-[var(--v-text)]">
        {copy.form.needNature}
        <span className="ml-1 text-xs font-normal text-[var(--v-muted)]">
          ({copy.form.needNatureOptional})
        </span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full appearance-none rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] bg-[length:1rem_1rem] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 text-sm font-medium text-[var(--v-text)] outline-none focus:border-[var(--primary-color)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        }}
      >
        <option value="">{copy.form.needNaturePlaceholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
