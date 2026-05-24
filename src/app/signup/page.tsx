import { AuthInscriptionPage } from "@/components/auth/AuthInscriptionPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

export default async function SignupPage() {
  const prepared = await prepareAuthPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <AuthInscriptionPage
      lang={defaultLocale}
      copy={dict.auth}
      unavailable={prepared.status === "unavailable"}
    />
  );
}
