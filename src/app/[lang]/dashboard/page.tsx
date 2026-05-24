import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/auth/DashboardShell";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { requireSessionProfile } from "@/lib/auth/guards";

type Props = { params: Promise<{ lang: string }> };

export default async function LangDashboardPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const session = await requireSessionProfile(lang);
  const dict = await getDictionary(lang);

  return <DashboardShell lang={lang} session={session} copy={dict.auth.dashboard} />;
}
