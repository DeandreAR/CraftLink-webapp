"use client";

import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import type { VitrineService } from "@/domain/vitrine";
import type { VitrineDictionary } from "@/i18n/types";

type VitrineServicesPickerProps = {
  services: VitrineService[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  copy: VitrineDictionary;
  defaultOpen?: boolean;
  required?: boolean;
  hint?: string;
};

export function VitrineServicesPicker({
  services,
  selectedIds,
  onToggle,
  copy,
  defaultOpen = false,
  required = true,
  hint,
}: VitrineServicesPickerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const det = copy.details;

  return (
    <div className="rounded-[24px] border border-[var(--v-muted)]/15 bg-[var(--v-surface)] shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
        aria-expanded={isOpen}
      >
        <span>
          <span className="block text-sm font-bold text-[var(--v-text)]">
            {det.servicesTitle}
          </span>
          <span className="mt-0.5 block text-xs text-[var(--v-muted)]">
            {hint ?? (required ? det.servicesHint : det.servicesOptionalHint)}
            {selectedIds.length > 0 ? ` · ${selectedIds.length} ${det.servicesSelected}` : ""}
          </span>
        </span>
        <LuChevronDown
          className={`h-5 w-5 shrink-0 text-[var(--v-muted)] transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <ul className="space-y-2 border-t border-[var(--v-muted)]/10 px-5 pb-5 pt-3">
          {services.map((service) => {
            const checked = selectedIds.includes(service.id);
            return (
              <li key={service.id}>
                <label
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition ${
                    checked
                      ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_8%,white)]"
                      : "border-[var(--v-muted)]/15 bg-[var(--bg-color)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary-color)]"
                    checked={checked}
                    onChange={() => onToggle(service.id)}
                  />
                  <span className="min-w-0 text-left">
                    <span className="block text-sm font-semibold text-[var(--v-text)]">
                      {service.title}
                    </span>
                    {service.description ? (
                      <span className="mt-0.5 block text-xs text-[var(--v-muted)]">
                        {service.description}
                      </span>
                    ) : null}
                    <span className="mt-1 block text-xs font-bold text-[var(--primary-color)]">
                      {service.priceHtLabel} · {copy.services.priceHt}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
