import { notFound } from "next/navigation";
import { AccountConfirmedPageClient } from "@/components/auth/AccountConfirmedPageClient";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { prepareAccountConfirmedPage } from "@/lib/auth/prepareAccountConfirmedPage";

type Props = { params: Promise<{ lang: string }> };

export default async function LangAccountConfirmedPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  await prepareAccountConfirmedPage(lang);
  const dict = await getDictionary(lang);

  return <AccountConfirmedPageClient lang={lang} copy={dict.onboarding} />;
}
