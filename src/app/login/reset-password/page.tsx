import { AuthResetPasswordPage } from "@/components/auth/AuthResetPasswordPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { preparePasswordResetPage } from "@/lib/auth/preparePasswordResetPage";

export default async function ResetPasswordPage() {
  const prepared = await preparePasswordResetPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <AuthResetPasswordPage
      lang={defaultLocale}
      copy={dict.auth}
      sessionReady={prepared.status === "ready"}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
