import { StatistiquesPageClient } from "@/components/dashboard/stats/StatistiquesPageClient";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { loadAudienceMetrics } from "@/lib/analytics/analyticsEvents";
import { requireSessionProfile } from "@/lib/auth/guards";
import { loadWorkspaceLeadsForSession } from "@/lib/leads/loadWorkspaceLeads";

export default async function StatistiquesPage() {
  const lang = defaultLocale;
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
