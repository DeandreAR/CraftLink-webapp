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
      label: "Abonnés Pro",
      value: formatInteger(kpis.subscribedPro),
      hint: "Abonnements Stripe actifs",
      accent: "text-emerald-400",
    },
    {
      label: "Essais actifs",
      value: formatInteger(kpis.activeTrials),
      hint: `${formatInteger(kpis.activeEssential)} Essentiel hors essai`,
      accent: "text-[#efa188]",
    },
    {
      label: "Conversion abonnés",
      value: formatPercent(kpis.conversionRatePercent),
      hint: "Inscrits → abonnement Pro payant",
      accent: "text-emerald-400",
    },
    {
      label: "Conversion essai → Pro",
      value: formatPercent(kpis.trialConversionRatePercent),
      hint: "Parmi les essais terminés (convertis ou expirés)",
      accent: "text-[#efa188]",
    },
    {
      label: "MRR estimé",
      value: formatCurrencyEur(kpis.mrrEur),
      hint: "Abonnés Pro × 19 € HT/mois",
      accent: "text-white",
    },
    {
      label: "Leads capturés",
      value: formatInteger(kpis.totalLeads),
      hint: `${formatInteger(kpis.urgencyLeads)} urgences (formulaire + WhatsApp)`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
