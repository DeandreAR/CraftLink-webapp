"use client";

import type { ReactNode } from "react";
import { FaEye, FaComments, FaToolbox } from "react-icons/fa6";
import type { AudienceMetrics } from "@/domain/analytics";
import type { DashboardDictionary } from "@/i18n/types";

type AudienceKpiSectionProps = {
  audience: AudienceMetrics;
  copy: DashboardDictionary;
};

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

/** Performance vitrine (30j) — réservé à l’onglet Statistiques Pro. */
export function AudienceKpiSection({ audience, copy }: AudienceKpiSectionProps) {
  const a = copy.leads.stats.audience;

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {a.title}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">{a.hint}</p>
      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <KpiCard icon={<FaEye />} label={a.pageViews} value={String(audience.pageViews)} />
        <KpiCard
          icon={<FaComments />}
          label={a.contacts}
          value={String(audience.contactClicks)}
        />
        <KpiCard
          icon={<FaToolbox />}
          label={a.materialClicks}
          value={String(audience.materialClicks)}
        />
      </div>
    </div>
  );
}
