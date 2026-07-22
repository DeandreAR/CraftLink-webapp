import { DashboardPageClient } from "@/components/auth/DashboardPageClient";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { requireSessionProfile } from "@/lib/auth/guards";
import {
  parseDashboardLeadId,
  parseDashboardTab,
} from "@/lib/dashboard/deepLink";
import { loadWorkspaceLeadsForSession } from "@/lib/leads/loadWorkspaceLeads";
import { loadWorkspacePartnershipRequestsForSession } from "@/lib/partnerships/loadWorkspacePartnershipRequests";
import { loadSubscriptionBillingForUser } from "@/lib/stripe/loadSubscriptionBilling";

type Props = {
  searchParams: Promise<{ tab?: string; lead?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const query = await searchParams;
  const session = await requireSessionProfile(defaultLocale);
  const dict = await getDictionary(defaultLocale);
  const billing = await loadSubscriptionBillingForUser(session.user.id);
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
      billing={billing}
      copy={dict.dashboard}
      onboardingCopy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      initialLeads={initialLeads}
      initialLoadError={initialLoadError}
      initialPartnershipRequests={initialPartnershipRequests}
      initialPartnershipLoadError={initialPartnershipLoadError}
      initialTab={parseDashboardTab(query.tab)}
      initialLeadId={parseDashboardLeadId(query.lead)}
    />
  );
}
