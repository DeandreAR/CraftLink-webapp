import { notFound } from "next/navigation";
import { AuthConnexionPage } from "@/components/auth/AuthConnexionPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function LangLoginPage({ params, searchParams }: Props) {
  const { lang: raw } = await params;
  const { error } = await searchParams;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const prepared = await prepareAuthPage(lang);
  const dict = await getDictionary(lang);

  return (
    <AuthConnexionPage
      lang={lang}
      copy={dict.auth}
      authError={error}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
