import { notFound } from "next/navigation";
import { StatistiquesPageClient } from "@/components/dashboard/stats/StatistiquesPageClient";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { loadAudienceMetrics } from "@/lib/analytics/analyticsEvents";
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
  const audience = await loadAudienceMetrics(session.user.id);

  return (
    <StatistiquesPageClient
      leads={leads}
      audience={audience}
      loadError={loadError}
      proAccess={session.profile}
      copy={dict.dashboard}
      locale={lang}
    />
  );
}
