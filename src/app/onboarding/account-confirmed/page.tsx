import { AccountConfirmedPageClient } from "@/components/auth/AccountConfirmedPageClient";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareAccountConfirmedPage } from "@/lib/auth/prepareAccountConfirmedPage";

export default async function AccountConfirmedPage() {
  await prepareAccountConfirmedPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return <AccountConfirmedPageClient lang={defaultLocale} copy={dict.onboarding} />;
}
