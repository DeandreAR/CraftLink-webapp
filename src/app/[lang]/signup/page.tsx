import { notFound } from "next/navigation";
import { AuthInscriptionPage } from "@/components/auth/AuthInscriptionPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

type Props = { params: Promise<{ lang: string }> };

export default async function LangSignupPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const prepared = await prepareAuthPage(lang);
  const dict = await getDictionary(lang);

  return (
    <AuthInscriptionPage
      lang={lang}
      copy={dict.auth}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
