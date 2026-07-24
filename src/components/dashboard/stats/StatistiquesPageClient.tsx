"use client";

import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProFeatureGuard } from "@/components/dashboard/ProFeatureGuard";
import { LeadsStatisticsPanel } from "@/components/dashboard/stats/LeadsStatisticsPanel";
import type { DashboardLead } from "@/domain/lead";
import type { ProAccessProfile } from "@/domain/proAccess";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";

type StatistiquesPageClientProps = {
  leads: DashboardLead[];
  loadError: string | null;
  proAccess: ProAccessProfile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function StatistiquesPageClient({
  leads,
  loadError,
  proAccess,
  copy,
  locale,
}: StatistiquesPageClientProps) {
  const s = copy.leads.stats;

  return (
    <main className="dashboard-page relative min-h-[100dvh] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="mb-4">
          <Link
            href={authPath(locale, "dashboard")}
            className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            ← {copy.organize.title}
          </Link>
        </p>
        <DashboardPageHeader title={s.title} subtitle={s.subtitle} />
        <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
          {loadError ? (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            >
              {loadError}
            </div>
          ) : null}
          <ProFeatureGuard
            feature="stats"
            proAccess={proAccess}
            copy={copy}
            locale={locale}
          >
            <LeadsStatisticsPanel leads={leads} copy={copy} locale={locale} />
          </ProFeatureGuard>
        </div>
      </div>
    </main>
  );
}
