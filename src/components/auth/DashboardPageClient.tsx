"use client";

import { DashboardEntrance } from "@/components/auth/DashboardEntrance";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DashboardPageClientProps = {
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

export function DashboardPageClient({
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
}: DashboardPageClientProps) {
  return (
    <DashboardEntrance loadingLabel={copy.loading}>
      <DashboardShell
        lang={lang}
        session={session}
        billing={billing}
        copy={copy}
        onboardingCopy={onboardingCopy}
        vitrineCopy={vitrineCopy}
        initialLeads={initialLeads}
        initialLoadError={initialLoadError}
        initialPartnershipRequests={initialPartnershipRequests}
        initialPartnershipLoadError={initialPartnershipLoadError}
        initialTab={initialTab}
        initialLeadId={initialLeadId}
      />
    </DashboardEntrance>
  );
}
