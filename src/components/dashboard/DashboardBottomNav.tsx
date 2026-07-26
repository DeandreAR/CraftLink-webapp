"use client";

import type { DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { DashboardDictionary } from "@/i18n/types";
import { FaBriefcase, FaChartLine, FaHandshake, FaUserGear } from "react-icons/fa6";

type DashboardBottomNavProps = {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  copy: DashboardDictionary;
};

const NAV_ITEMS: { id: DashboardTab; icon: typeof FaBriefcase }[] = [
  { id: "inbox", icon: FaBriefcase },
  { id: "organize", icon: FaChartLine },
  { id: "profile", icon: FaUserGear },
  { id: "partners", icon: FaHandshake },
];

export function DashboardBottomNav({ active, onChange, copy }: DashboardBottomNavProps) {
  const labels = copy.tabs;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-black/8 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
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
                className={`relative flex w-full min-h-[64px] cursor-pointer flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-semibold transition-colors duration-150 ${
                  isActive ? "text-black" : "text-zinc-400"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-[14px] transition-colors duration-150 ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-transparent text-zinc-400"
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
