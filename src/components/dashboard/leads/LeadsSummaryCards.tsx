"use client";

import { FaBolt, FaCalendarCheck, FaClipboardList, FaCircleCheck } from "react-icons/fa6";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import type { LeadsSummaryStats } from "@/lib/leads/leadStats";
import type { DashboardDictionary } from "@/i18n/types";

type LeadsSummaryCardsProps = {
  stats: LeadsSummaryStats;
  copy: DashboardDictionary;
};

type SummaryCard = {
  key: keyof LeadsSummaryStats;
  icon: typeof FaClipboardList;
  accent: string;
  iconWrap: string;
};

const CARDS: SummaryCard[] = [
  {
    key: "total",
    icon: FaClipboardList,
    accent: "text-slate-900",
    iconWrap: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
  },
  {
    key: "urgent",
    icon: FaBolt,
    accent: "text-red-700",
    iconWrap: "bg-red-50 text-red-600 ring-1 ring-red-100",
  },
  {
    key: "asap",
    icon: FaCalendarCheck,
    accent: "text-amber-800",
    iconWrap: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  },
  {
    key: "done",
    icon: FaCircleCheck,
    accent: "text-emerald-700",
    iconWrap: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  },
];

export function LeadsSummaryCards({ stats, copy }: LeadsSummaryCardsProps) {
  const s = copy.leads.summary;

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4" data-tour="dashboard-kpis">
      {CARDS.map(({ key, icon: Icon, accent, iconWrap }) => (
        <DashboardCard key={key} as="article" variant="flat" className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {s[key]}
            </p>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${accent}`}>{stats[key]}</p>
        </DashboardCard>
      ))}
    </div>
  );
}
