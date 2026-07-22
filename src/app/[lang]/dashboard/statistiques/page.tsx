import { notFound } from "next/navigation";
import { StatistiquesPageClient } from "@/components/dashboard/stats/StatistiquesPageClient";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { requireSessionProfile } from "@/lib/auth/guards";
import { loadWorkspaceLeadsForSession } from "@/lib/leads/loadWorkspaceLeads";

type Props = { params: Promise<{ lang: string }> };

export default async function LangStatistiquesPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const session = await requireSessionProfile(lang);
  const dict = await getDictionary(lang);
  const { leads, loadError } = await loadWorkspaceLeadsForSession(session);

  return (
    <StatistiquesPageClient
      leads={leads}
      loadError={loadError}
      planTier={session.profile.plan_tier}
      copy={dict.dashboard}
      locale={lang}
    />
  );
}
