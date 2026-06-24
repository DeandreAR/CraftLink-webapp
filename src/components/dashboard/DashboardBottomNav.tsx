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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white md:hidden"
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
                  isActive ? "text-black" : "text-neutral-400"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-black" : "text-neutral-400"}`} aria-hidden />
                <span className="truncate">{labels[id]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
