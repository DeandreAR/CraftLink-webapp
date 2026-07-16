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
  className?: string;
};

/** Onglets segmentés — style Mokaform, accent corail. */
export function DashboardViewTabs<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
  className = "",
}: DashboardViewTabsProps<T>) {
  return (
    <div
      className={`scrollbar-hide mb-4 flex w-full max-w-full gap-1 overflow-x-auto rounded-2xl border border-[#212129]/8 bg-white/90 p-1 shadow-[0_8px_24px_rgba(33,33,41,0.05)] backdrop-blur-sm ${className}`.trim()}
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
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 sm:px-4 ${
              isActive
                ? "bg-[#212129] text-white shadow-[0_6px_18px_rgba(33,33,41,0.2)]"
                : "text-[#5b6478] hover:bg-[#EFA188]/12 hover:text-[#212129]"
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
