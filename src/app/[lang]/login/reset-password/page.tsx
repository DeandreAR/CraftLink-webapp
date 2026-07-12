import { notFound } from "next/navigation";
import { AuthResetPasswordPage } from "@/components/auth/AuthResetPasswordPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { preparePasswordResetPage } from "@/lib/auth/preparePasswordResetPage";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LangResetPasswordPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const prepared = await preparePasswordResetPage(lang);
  const dict = await getDictionary(lang);

  return (
    <AuthResetPasswordPage
      lang={lang}
      copy={dict.auth}
      sessionReady={prepared.status === "ready"}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
