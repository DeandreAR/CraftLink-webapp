import { DashboardPageClient } from "@/components/auth/DashboardPageClient";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { requireSessionProfile } from "@/lib/auth/guards";

export default async function DashboardPage() {
  const session = await requireSessionProfile(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <DashboardPageClient
      lang={defaultLocale}
      session={session}
      copy={dict.auth.dashboard}
    />
  );
}
