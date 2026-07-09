"use client";

import type { ReactNode } from "react";

export type DashboardViewTab<T extends string> = {
  id: T;
  label: string;
  icon?: ReactNode;
};

type DashboardViewTabsProps<T extends string> = {
  tabs: DashboardViewTab<T>[];
  active: T;
  onChange: (id: T) => void;
  ariaLabel: string;
};

/** Onglets de vue type Asana — soulignement actif, fond blanc. */
export function DashboardViewTabs<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
}: DashboardViewTabsProps<T>) {
  return (
    <div
      className="flex gap-1 overflow-x-auto border-b border-neutral-200"
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition sm:px-4 ${
              isActive
                ? "border-black text-black"
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
