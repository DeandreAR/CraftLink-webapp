"use client";

import type { DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { DashboardDictionary } from "@/i18n/types";
import { FaBriefcase, FaHandshake, FaUser, FaUsers } from "react-icons/fa6";

type DashboardBottomNavProps = {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  copy: DashboardDictionary;
};

const NAV_ITEMS: { id: DashboardTab; icon: typeof FaBriefcase }[] = [
  { id: "leads", icon: FaBriefcase },
  { id: "vitrine", icon: FaUser },
  { id: "partners", icon: FaHandshake },
  { id: "account", icon: FaUsers },
];

export function DashboardBottomNav({ active, onChange, copy }: DashboardBottomNavProps) {
  const labels = copy.tabs;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[#1a1d24] md:hidden"
      aria-label="Navigation tableau de bord"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                className={`flex w-full flex-col items-center gap-0.5 px-1 py-2.5 text-[9px] font-semibold transition ${
                  isActive ? "text-white" : "text-neutral-500"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isActive ? "bg-[#EFA188]/20 text-[#EFA188]" : "text-neutral-500"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="truncate">{labels[id]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
