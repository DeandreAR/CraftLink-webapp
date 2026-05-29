import { notFound } from "next/navigation";
import { OnboardingPage } from "@/components/onboarding/OnboardingPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export default async function LangOnboardingPage({ params, searchParams }: Props) {
  const { lang: raw } = await params;
  const { plan } = await searchParams;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;
  const dict = await getDictionary(lang);
  const planIntent = plan === "pro" ? "pro" : "choice";

  return (
    <OnboardingPage
      lang={lang}
      copy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      loginLabel={dict.nav.login}
      planIntent={planIntent}
    />
  );
}
