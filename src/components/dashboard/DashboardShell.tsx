import { DashboardLayout, type DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DashboardShellProps = {
  lang: Locale;
  session: WorkspaceSession;
  billing: SubscriptionBillingSnapshot | null;
  copy: DashboardDictionary;
  onboardingCopy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
  initialPartnershipRequests: DashboardPartnershipRequest[];
  initialPartnershipLoadError: string | null;
  initialTab?: DashboardTab;
  initialLeadId?: string | null;
};

export function DashboardShell({
  lang,
  session,
  billing,
  copy,
  onboardingCopy,
  vitrineCopy,
  initialLeads,
  initialLoadError,
  initialPartnershipRequests,
  initialPartnershipLoadError,
  initialTab = "inbox",
  initialLeadId = null,
}: DashboardShellProps) {
  return (
    <DashboardLayout
      session={session}
      billing={billing}
      copy={copy}
      onboardingCopy={onboardingCopy}
      vitrineCopy={vitrineCopy}
      locale={lang}
      initialLeads={initialLeads}
      initialLoadError={initialLoadError}
      initialPartnershipRequests={initialPartnershipRequests}
      initialPartnershipLoadError={initialPartnershipLoadError}
      initialTab={initialTab}
      initialLeadId={initialLeadId}
    />
  );
}
