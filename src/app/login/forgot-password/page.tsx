import { AuthForgotPasswordPage } from "@/components/auth/AuthForgotPasswordPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

export default async function ForgotPasswordPage() {
  const prepared = await prepareAuthPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <AuthForgotPasswordPage
      lang={defaultLocale}
      copy={dict.auth}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
