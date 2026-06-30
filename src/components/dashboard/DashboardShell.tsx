import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { DashboardLead } from "@/domain/lead";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DashboardShellProps = {
  lang: Locale;
  session: WorkspaceSession;
  copy: DashboardDictionary;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
};

export function DashboardShell({
  lang,
  session,
  copy,
  initialLeads,
  initialLoadError,
}: DashboardShellProps) {
  return (
    <DashboardLayout
      session={session}
      copy={copy}
      locale={lang}
      initialLeads={initialLeads}
      initialLoadError={initialLoadError}
    />
  );
}
