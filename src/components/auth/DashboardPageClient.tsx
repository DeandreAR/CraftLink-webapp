"use client";

import { DashboardEntrance } from "@/components/auth/DashboardEntrance";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DashboardPageClientProps = {
  lang: Locale;
  session: WorkspaceSession;
  copy: DashboardDictionary;
  onboardingCopy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
  initialPartnershipRequests: DashboardPartnershipRequest[];
  initialPartnershipLoadError: string | null;
};

export function DashboardPageClient({
  lang,
  session,
  copy,
  onboardingCopy,
  vitrineCopy,
  initialLeads,
  initialLoadError,
  initialPartnershipRequests,
  initialPartnershipLoadError,
}: DashboardPageClientProps) {
  return (
    <DashboardEntrance loadingLabel={copy.loading}>
      <DashboardShell
        lang={lang}
        session={session}
        copy={copy}
        onboardingCopy={onboardingCopy}
        vitrineCopy={vitrineCopy}
        initialLeads={initialLeads}
        initialLoadError={initialLoadError}
        initialPartnershipRequests={initialPartnershipRequests}
        initialPartnershipLoadError={initialPartnershipLoadError}
      />
    </DashboardEntrance>
  );
}
