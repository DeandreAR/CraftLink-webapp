import { AuthConnexionPage } from "@/components/auth/AuthConnexionPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

export default async function LoginPage() {
  const prepared = await prepareAuthPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <AuthConnexionPage
      lang={defaultLocale}
      copy={dict.auth}
      unavailable={prepared.status === "unavailable"}
    />
  );
}
