"use client";

import { DashboardEntrance } from "@/components/auth/DashboardEntrance";
import { DashboardShell } from "@/components/auth/DashboardShell";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { AuthDashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DashboardPageClientProps = {
  lang: Locale;
  session: WorkspaceSession;
  copy: AuthDashboardDictionary;
};

export function DashboardPageClient({
  lang,
  session,
  copy,
}: DashboardPageClientProps) {
  return (
    <DashboardEntrance loadingLabel={copy.loading}>
      <DashboardShell lang={lang} session={session} copy={copy} />
    </DashboardEntrance>
  );
}
