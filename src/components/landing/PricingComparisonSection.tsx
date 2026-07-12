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

  return (
    <section
      id="tarifs"
      className="lk-section-alt scroll-mt-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <div className="max-w-3xl">
          <span className="lk-eyebrow">{copy.sectionEyebrow}</span>
          <h2 id="pricing-heading" className="lk-display mt-5 text-3xl md:text-[2.65rem]">
            {copy.sectionTitle}
          </h2>
          <p className="lk-lead mt-4 text-base md:text-lg">{copy.sectionLead}</p>
        </div>

        <div className="mt-8 hidden md:mt-10 md:block">
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-white">
                  <th className="px-4 py-4 font-semibold text-neutral-900 md:px-6">
                    {copy.tableCriterion}
                  </th>
                  <th className="px-4 py-4 font-semibold text-neutral-900 md:px-6">
                    {copy.tableClassic}
                  </th>
                  <th className="border-l-4 border-[#EFA188] bg-[#EFA188]/10 px-4 py-4 font-semibold text-neutral-900 md:px-6">
                    {copy.tableCraftlink}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {model.comparisonRows.map((row) => (
                  <tr key={row.criterion}>
                    <td className="px-4 py-4 font-medium text-neutral-900 md:px-6">
                      {row.criterion}
                    </td>
                    <td className="px-4 py-4 text-neutral-600 md:px-6">{row.classic}</td>
                    <td className="border-l-4 border-[#EFA188]/60 bg-[#EFA188]/5 px-4 py-4 text-neutral-800 md:px-6">
                      {row.craftlink}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:mt-10 md:hidden">
          {model.comparisonRows.map((row) => (
            <article key={row.criterion} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-bold text-neutral-900">{row.criterion}</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    {copy.mobileClassicShort}
                  </p>
                  <p className="mt-1 leading-relaxed text-neutral-600">{row.classic}</p>
                </div>
                <div className="border-t border-neutral-100 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#EFA188]">
                    {copy.mobileCraftlinkShort}
                  </p>
                  <p className="mt-1 font-medium leading-relaxed text-neutral-900">
                    {row.craftlink}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 md:mt-12">
          <PricingGrid model={model} basePath={basePath} locale={locale} />
        </div>
      </div>
    </section>
  );
}
