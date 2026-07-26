import { notFound } from "next/navigation";
import { DashboardPageClient } from "@/components/auth/DashboardPageClient";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { loadAudienceMetrics } from "@/lib/analytics/analyticsEvents";
import { requireSessionProfile } from "@/lib/auth/guards";
import {
  parseDashboardLeadId,
  parseDashboardTab,
} from "@/lib/dashboard/deepLink";
import { loadWorkspaceLeadsForSession } from "@/lib/leads/loadWorkspaceLeads";
import { loadWorkspacePartnershipRequestsForSession } from "@/lib/partnerships/loadWorkspacePartnershipRequests";
import { loadSubscriptionBillingForUser } from "@/lib/stripe/loadSubscriptionBilling";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tab?: string; lead?: string }>;
};

export default async function LangDashboardPage({ params, searchParams }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;
  const query = await searchParams;

  const session = await requireSessionProfile(lang);
  const dict = await getDictionary(lang);
  const billing = await loadSubscriptionBillingForUser(session.user.id);
  const { leads: initialLeads, loadError: initialLoadError } =
    await loadWorkspaceLeadsForSession(session);
  const {
    requests: initialPartnershipRequests,
    loadError: initialPartnershipLoadError,
  } = await loadWorkspacePartnershipRequestsForSession(session);
  const initialAudienceMetrics = await loadAudienceMetrics(session.user.id);

  return (
    <DashboardPageClient
      lang={lang}
      session={session}
      billing={billing}
      copy={dict.dashboard}
      onboardingCopy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      initialLeads={initialLeads}
      initialLoadError={initialLoadError}
      initialPartnershipRequests={initialPartnershipRequests}
      initialPartnershipLoadError={initialPartnershipLoadError}
      initialAudienceMetrics={initialAudienceMetrics}
      initialTab={parseDashboardTab(query.tab)}
      initialLeadId={parseDashboardLeadId(query.lead)}
    />
  );
}
