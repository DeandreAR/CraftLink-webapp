import { notFound } from "next/navigation";
import { DashboardPageClient } from "@/components/auth/DashboardPageClient";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { requireSessionProfile } from "@/lib/auth/guards";
import { loadWorkspaceLeadsForSession } from "@/lib/leads/loadWorkspaceLeads";

type Props = { params: Promise<{ lang: string }> };

export default async function LangDashboardPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const session = await requireSessionProfile(lang);
  const dict = await getDictionary(lang);
  const { leads: initialLeads, loadError: initialLoadError } =
    await loadWorkspaceLeadsForSession(session);

  return (
    <DashboardPageClient
      lang={lang}
      session={session}
      copy={dict.dashboard}
      initialLeads={initialLeads}
      initialLoadError={initialLoadError}
    />
  );
}
