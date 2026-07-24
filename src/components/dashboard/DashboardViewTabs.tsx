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

/** Segmented control — barre unifiée style Linear / Vercel. */
export function DashboardViewTabs<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
  className = "",
}: DashboardViewTabsProps<T>) {
  return (
    <div
      className={`db-segmented scrollbar-hide mb-4 w-full max-w-full ${className}`.trim()}
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
            data-active={isActive ? "true" : undefined}
            onClick={() => onChange(tab.id)}
            className="db-segmented-item flex cursor-pointer items-center gap-2"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
