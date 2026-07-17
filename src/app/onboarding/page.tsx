import { OnboardingPage } from "@/components/onboarding/OnboardingPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareOnboardingPage } from "@/lib/auth/prepareOnboardingPage";
import { buildPricingSectionModel } from "@/services/pricingComparisonSection";

type Props = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function OnboardingRootPage({ searchParams }: Props) {
  const { resume } = await prepareOnboardingPage(defaultLocale);
  const { plan } = await searchParams;
  const dict = await getDictionary(defaultLocale);
  const planIntent = plan === "pro" ? "pro" : "choice";
  const pricingModel = buildPricingSectionModel(dict.pricingComparison);

  return (
    <OnboardingPage
      lang={defaultLocale}
      copy={dict.onboarding}
      vitrineCopy={dict.vitrine}
      pricingModel={pricingModel}
      planIntent={planIntent}
      resume={resume}
    />
  );
}
