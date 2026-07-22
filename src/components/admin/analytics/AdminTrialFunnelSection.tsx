import type { AdminTrialFunnelSnapshot } from "@/domain/adminAnalytics";
import { AdminCard, AdminSection } from "@/components/admin/analytics/AdminShell";
import {
  formatInteger,
  formatPercent,
} from "@/lib/admin/formatAdminMetrics";

type AdminTrialFunnelSectionProps = {
  funnel: AdminTrialFunnelSnapshot;
};

type FunnelItem = {
  label: string;
  value: string;
  hint: string;
  accent?: string;
};

export function AdminTrialFunnelSection({ funnel }: AdminTrialFunnelSectionProps) {
  const items: FunnelItem[] = [
    {
      label: "Essais démarrés",
      value: formatInteger(funnel.trialsStarted),
      hint: `+${formatInteger(funnel.trialsStarted7d)} / 7j · +${formatInteger(funnel.trialsStarted30d)} / 30j`,
      accent: "text-white",
    },
    {
      label: "Essais en cours",
      value: formatInteger(funnel.activeTrials),
      hint: `${formatInteger(funnel.trialsExpiringSoon)} expirent sous 48 h`,
      accent: "text-[#efa188]",
    },
    {
      label: "Essais expirés",
      value: formatInteger(funnel.expiredTrials),
      hint: "Non convertis après les 14 jours",
    },
    {
      label: "Convertis en Pro",
      value: formatInteger(funnel.convertedToPro),
      hint: `Taux ${formatPercent(funnel.trialConversionRatePercent)} sur essais terminés`,
      accent: "text-emerald-400",
    },
  ];

  return (
    <AdminSection
      title="Funnel essai Pro"
      description="Suivi de l’essai 14 jours : démarrages, expiration, conversion en abonnement Stripe."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <AdminCard key={item.label}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              {item.label}
            </p>
            <p
              className={`mt-3 text-2xl font-semibold tracking-tight ${item.accent ?? "text-zinc-100"}`}
            >
              {item.value}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{item.hint}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          Emails d’essai envoyés
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <dt className="text-xs text-zinc-500">Milieu (J+7)</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">
              {formatInteger(funnel.emailsMidSent)}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <dt className="text-xs text-zinc-500">Alerte (J−2)</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">
              {formatInteger(funnel.emailsWarningSent)}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <dt className="text-xs text-zinc-500">Expiration (J+14)</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">
              {formatInteger(funnel.emailsExpiredSent)}
            </dd>
          </div>
        </dl>
      </AdminCard>
    </AdminSection>
  );
}
