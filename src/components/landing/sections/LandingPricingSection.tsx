import { PricingGrid } from "@/components/landing/PricingGrid";
import type { Locale } from "@/i18n/config";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type LandingPricingSectionProps = {
  model: PricingSectionModel;
  basePath: string;
  locale: Locale;
};

/** Tarifs OpenShip Light — Essentiel vs Pro, sans bloc sombre. */
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
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="lk-eyebrow">{copy.sectionEyebrow}</span>
          <h2
            id="pricing-heading"
            className="lk-display mt-5 text-3xl text-zinc-900 md:text-4xl"
          >
            {copy.sectionTitle}
          </h2>
          <p className="mt-4 text-base text-zinc-500 md:text-lg">{copy.sectionLead}</p>
        </div>

        <div className="mt-12 md:mt-16">
          <PricingGrid model={model} basePath={basePath} locale={locale} layout="grid" />
        </div>
      </div>
    </section>
  );
}
