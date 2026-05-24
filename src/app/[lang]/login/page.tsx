import { notFound } from "next/navigation";
import { AuthConnexionPage } from "@/components/auth/AuthConnexionPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

type Props = { params: Promise<{ lang: string }> };

export default async function LangLoginPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const prepared = await prepareAuthPage(lang);
  const dict = await getDictionary(lang);

  return (
    <AuthConnexionPage
      lang={lang}
      copy={dict.auth}
      unavailable={prepared.status === "unavailable"}
    />
  );
}
