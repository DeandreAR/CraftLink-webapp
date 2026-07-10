"use client";

import { FaBolt, FaCalendarCheck, FaClipboardList, FaCircleCheck } from "react-icons/fa6";
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
  iconBg: string;
};

const CARDS: SummaryCard[] = [
  { key: "total", icon: FaClipboardList, accent: "text-slate-900", iconBg: "bg-slate-100 text-slate-600" },
  { key: "urgent", icon: FaBolt, accent: "text-red-700", iconBg: "bg-red-50 text-red-600" },
  { key: "asap", icon: FaCalendarCheck, accent: "text-amber-800", iconBg: "bg-amber-50 text-amber-600" },
  { key: "done", icon: FaCircleCheck, accent: "text-emerald-700", iconBg: "bg-emerald-50 text-emerald-600" },
];

export function LeadsSummaryCards({ stats, copy }: LeadsSummaryCardsProps) {
  const s = copy.leads.summary;

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map(({ key, icon: Icon, accent, iconBg }) => (
        <article
          key={key}
          className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm shadow-neutral-100"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">{s[key]}</p>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${accent}`}>{stats[key]}</p>
        </article>
      ))}
    </div>
  );
}
