import { DashboardPageClient } from "@/components/auth/DashboardPageClient";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { requireSessionProfile } from "@/lib/auth/guards";
import { loadWorkspaceLeadsForSession } from "@/lib/leads/loadWorkspaceLeads";
import { loadWorkspacePartnershipRequestsForSession } from "@/lib/partnerships/loadWorkspacePartnershipRequests";

export default async function DashboardPage() {
  const session = await requireSessionProfile(defaultLocale);
  const dict = await getDictionary(defaultLocale);
  const { leads: initialLeads, loadError: initialLoadError } =
    await loadWorkspaceLeadsForSession(session);
  const {
    requests: initialPartnershipRequests,
    loadError: initialPartnershipLoadError,
  } = await loadWorkspacePartnershipRequestsForSession(session);

  return (
    <DashboardPageClient
      lang={defaultLocale}
      session={session}
      copy={dict.dashboard}
      onboardingCopy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      initialLeads={initialLeads}
      initialLoadError={initialLoadError}
      initialPartnershipRequests={initialPartnershipRequests}
      initialPartnershipLoadError={initialPartnershipLoadError}
    />
  );
}
