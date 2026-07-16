import { PricingGrid } from "@/components/landing/PricingGrid";
import type { Locale } from "@/i18n/config";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type PricingComparisonSectionProps = {
  model: PricingSectionModel;
  basePath: string;
  locale: Locale;
};

export function PricingComparisonSection({
  model,
  basePath,
  locale,
}: PricingComparisonSectionProps) {
  const { copy } = model;
  const contrast = copy.splitContrast;

  return (
    <section
      id="tarifs"
      className="lk-section-alt scroll-mt-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="max-w-3xl">
          <span className="lk-eyebrow">{copy.sectionEyebrow}</span>
          <h2 id="pricing-heading" className="lk-display mt-5 text-3xl md:text-[2.65rem]">
            {copy.sectionTitle}
          </h2>
          <p className="lk-lead mt-4 text-base md:text-lg">{copy.sectionLead}</p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border-2 border-[#212129] md:mt-12">
          <div className="bg-gradient-to-br from-red-950 via-[#212129] to-[#212129] px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
              <div className="max-w-xl">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-300">
                  {contrast.eyebrow}
                </span>
                <p className="lk-display mt-3 text-2xl text-white md:text-3xl">
                  {contrast.headline}
                </p>
              </div>
              <p className="shrink-0 self-start rounded-2xl border-2 border-[#EFA188] bg-[#EFA188]/15 px-5 py-3 text-center text-lg font-black tracking-tight text-[#EFA188] md:text-xl">
                {contrast.payoff}
              </p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {contrast.painPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm font-medium leading-snug text-red-100 md:text-base"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"
                    aria-hidden
                  >
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                      <path
                        d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PricingGrid model={model} basePath={basePath} locale={locale} layout="grid" />
      </div>
    </section>
  );
}
