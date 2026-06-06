import { OnboardingPage } from "@/components/onboarding/OnboardingPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

type Props = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function OnboardingRootPage({ searchParams }: Props) {
  const { plan } = await searchParams;
  const dict = await getDictionary(defaultLocale);
  const planIntent = plan === "pro" ? "pro" : "choice";

  return (
    <OnboardingPage
      lang={defaultLocale}
      copy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      loginLabel={dict.nav.login}
      planIntent={planIntent}
    />
  );
}
