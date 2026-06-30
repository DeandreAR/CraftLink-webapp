"use client";

import { DashboardEntrance } from "@/components/auth/DashboardEntrance";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { DashboardLead } from "@/domain/lead";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DashboardPageClientProps = {
  lang: Locale;
  session: WorkspaceSession;
  copy: DashboardDictionary;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
};

export function DashboardPageClient({
  lang,
  session,
  copy,
  initialLeads,
  initialLoadError,
}: DashboardPageClientProps) {
  return (
    <DashboardEntrance loadingLabel={copy.loading}>
      <DashboardShell
        lang={lang}
        session={session}
        copy={copy}
        initialLeads={initialLeads}
        initialLoadError={initialLoadError}
      />
    </DashboardEntrance>
  );
}
