import { PricingGrid } from "@/components/landing/PricingGrid";
import { LandingConstatCard } from "@/components/landing/sections/LandingConstatCard";
import type { Locale } from "@/i18n/config";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type LandingPricingSectionProps = {
  model: PricingSectionModel;
  basePath: string;
  locale: Locale;
};

export function LandingPricingSection({
  model,
  basePath,
  locale,
}: LandingPricingSectionProps) {
  const { copy } = model;

  return (
    <section
      id="tarifs"
      className="lk-section scroll-mt-28"
      aria-labelledby="pricing-heading"
    >
      <div className="lk-container lk-section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="lk-eyebrow">{copy.sectionEyebrow}</span>
          <h2
            id="pricing-heading"
            className="lk-display mt-5 text-[1.85rem] sm:text-3xl md:text-4xl lg:text-[2.65rem]"
          >
            {copy.sectionTitle}
          </h2>
          <p className="lk-lead mt-4 text-base md:text-lg">{copy.sectionLead}</p>
          <hr className="lk-paint-rule mx-auto mt-8" aria-hidden />
        </div>

        <LandingConstatCard contrast={copy.splitContrast} />

        <div className="mt-12 md:mt-16">
          <PricingGrid model={model} basePath={basePath} locale={locale} layout="grid" />
        </div>
      </div>
    </section>
  );
}
