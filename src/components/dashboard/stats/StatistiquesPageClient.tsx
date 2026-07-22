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
    <main className="dashboard-page relative min-h-[100dvh] px-4 py-8 text-[#212129] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#EFA188]/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#D6BCFA]/12 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="mb-4">
          <Link
            href={authPath(locale, "dashboard")}
            className="text-sm font-semibold text-[#5b6478] underline-offset-2 hover:text-[#212129] hover:underline"
          >
            ← {copy.organize.title}
          </Link>
        </p>
        <DashboardPageHeader title={s.title} subtitle={s.subtitle} />
        <div className="mt-4 rounded-[1.5rem] border border-[#212129]/8 bg-white/60 p-4 shadow-[0_16px_48px_rgba(33,33,41,0.06)] backdrop-blur-sm md:p-5">
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
