import { OnboardingPage } from "@/components/onboarding/OnboardingPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareOnboardingPage } from "@/lib/auth/prepareOnboardingPage";

type Props = {
  searchParams: Promise<{ plan?: string; confirmed?: string }>;
};

export default async function OnboardingRootPage({ searchParams }: Props) {
  await prepareOnboardingPage(defaultLocale);
  const { plan, confirmed } = await searchParams;
  const dict = await getDictionary(defaultLocale);
  const planIntent = plan === "pro" ? "pro" : "choice";

  return (
    <OnboardingPage
      lang={defaultLocale}
      copy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      planIntent={planIntent}
      emailConfirmed={confirmed === "1"}
    />
  );
}
