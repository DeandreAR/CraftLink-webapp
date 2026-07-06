import type { ApiUsageSummary } from "@/domain/adminAnalytics";
import {
  AdminBadge,
  AdminCard,
  AdminSection,
} from "@/components/admin/analytics/AdminShell";
import {
  formatCurrencyEur,
  formatCurrencyUsd,
  formatInteger,
} from "@/lib/admin/formatAdminMetrics";

type AdminApiUsageSectionProps = {
  apiUsage: ApiUsageSummary;
};

export function AdminApiUsageSection({ apiUsage }: AdminApiUsageSectionProps) {
  const maxRequests = Math.max(...apiUsage.byModel.map((row) => row.requestCount), 1);

  return (
    <AdminSection
      title="Tracking APIs & coûts"
      description="Suivi Whisper (audio), GPT-4o mini (qualification) et estimation de marge par artisan Pro."
      badge={
        apiUsage.isMock ? (
          <AdminBadge tone="warning">Données mock — table api_usage_logs</AdminBadge>
        ) : (
          <AdminBadge tone="success">Live Supabase</AdminBadge>
        )
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Coût API — {apiUsage.monthLabel}
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatCurrencyUsd(apiUsage.totalCostUsd)}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            ≈ {formatCurrencyEur(apiUsage.totalCostEur, 2)}
          </p>
          <dl className="mt-5 space-y-3 border-t border-zinc-800 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Requêtes LLM</dt>
              <dd className="font-medium text-zinc-200">
                {formatInteger(apiUsage.totalRequests)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Tokens input</dt>
              <dd className="font-medium text-zinc-200">
                {formatInteger(apiUsage.totalInputTokens)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Tokens output</dt>
              <dd className="font-medium text-zinc-200">
                {formatInteger(apiUsage.totalOutputTokens)}
              </dd>
            </div>
          </dl>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Marge par utilisateur Pro
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-zinc-500">Abonnement Pro</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {formatCurrencyEur(apiUsage.proSubscriptionEur)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Coût API moyen / Pro</p>
              <p className="mt-1 text-xl font-semibold text-amber-300">
                {formatCurrencyEur(apiUsage.avgApiCostPerProUserEur, 2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Marge estimée / Pro</p>
              <p className="mt-1 text-xl font-semibold text-emerald-400">
                {formatCurrencyEur(apiUsage.marginPerProUserEur, 2)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Calcul : {formatCurrencyEur(apiUsage.proSubscriptionEur)} − coût API mensuel moyen
            ({formatInteger(apiUsage.proSubscriberCount)} abonnés Pro actifs).
          </p>

          <div className="mt-6 space-y-4">
            {apiUsage.byModel.map((row) => {
              const widthPercent = Math.max(8, (row.requestCount / maxRequests) * 100);
              return (
                <div key={`${row.provider}-${row.model}`}>
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-zinc-200">
                      {row.model}{" "}
                      <span className="font-normal text-zinc-500">· {row.operation}</span>
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatInteger(row.requestCount)} req · {formatCurrencyUsd(row.estimatedCostUsd)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </div>

      <AdminCard className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <th className="pb-3 pr-4">Fournisseur</th>
              <th className="pb-3 pr-4">Modèle</th>
              <th className="pb-3 pr-4">Opération</th>
              <th className="pb-3 pr-4 text-right">Requêtes</th>
              <th className="pb-3 pr-4 text-right">Tokens in</th>
              <th className="pb-3 pr-4 text-right">Tokens out</th>
              <th className="pb-3 text-right">Coût USD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {apiUsage.byModel.map((row) => (
              <tr key={`${row.provider}-${row.model}-${row.operation}`} className="text-zinc-300">
                <td className="py-3 pr-4">{row.provider}</td>
                <td className="py-3 pr-4 font-medium text-zinc-100">{row.model}</td>
                <td className="py-3 pr-4 text-zinc-400">{row.operation}</td>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {formatInteger(row.requestCount)}
                </td>
                <td className="py-3 pr-4 text-right tabular-nums text-zinc-500">
                  {formatInteger(row.inputTokens)}
                </td>
                <td className="py-3 pr-4 text-right tabular-nums text-zinc-500">
                  {formatInteger(row.outputTokens)}
                </td>
                <td className="py-3 text-right tabular-nums text-amber-200">
                  {formatCurrencyUsd(row.estimatedCostUsd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </AdminSection>
  );
}
