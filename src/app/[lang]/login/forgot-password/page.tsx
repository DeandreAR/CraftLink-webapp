import { notFound } from "next/navigation";
import { AuthForgotPasswordPage } from "@/components/auth/AuthForgotPasswordPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LangForgotPasswordPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const prepared = await prepareAuthPage(lang);
  const dict = await getDictionary(lang);

  return (
    <AuthForgotPasswordPage
      lang={lang}
      copy={dict.auth}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
