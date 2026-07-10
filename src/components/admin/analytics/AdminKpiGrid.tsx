import type { AdminKpiSnapshot } from "@/domain/adminAnalytics";
import { AdminCard } from "@/components/admin/analytics/AdminShell";
import {
  formatCurrencyEur,
  formatInteger,
  formatPercent,
} from "@/lib/admin/formatAdminMetrics";

type AdminKpiGridProps = {
  kpis: AdminKpiSnapshot;
};

type KpiItem = {
  label: string;
  value: string;
  hint: string;
  accent?: string;
};

export function AdminKpiGrid({ kpis }: AdminKpiGridProps) {
  const items: KpiItem[] = [
    {
      label: "Inscriptions",
      value: formatInteger(kpis.totalArtisans),
      hint: `+${formatInteger(kpis.artisansDelta7d)} nouveaux inscrits sur 7 jours`,
      accent: "text-white",
    },
    {
      label: "Utilisateurs actifs",
      value: `${formatInteger(kpis.activePro)} Pro · ${formatInteger(kpis.activeEssential)} Essentiel`,
      hint: "Répartition des plans actuels",
    },
    {
      label: "Taux de conversion Pro",
      value: formatPercent(kpis.conversionRatePercent),
      hint: "Inscrits passés en offre Pro",
      accent: "text-emerald-400",
    },
    {
      label: "MRR estimé",
      value: formatCurrencyEur(kpis.mrrEur),
      hint: "Basé sur abonnements Pro actifs (19 € HT/mois)",
      accent: "text-white",
    },
    {
      label: "Leads capturés",
      value: formatInteger(kpis.totalLeads),
      hint: `${formatInteger(kpis.urgencyLeads)} urgences (formulaire + WhatsApp)`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <AdminCard key={item.label}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            {item.label}
          </p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${item.accent ?? "text-zinc-100"}`}>
            {item.value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">{item.hint}</p>
        </AdminCard>
      ))}
    </div>
  );
}
