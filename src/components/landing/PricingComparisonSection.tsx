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
      className="lk-section-alt scroll-mt-28 border-t border-neutral-100"
      aria-labelledby="pricing-comparison-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <div className="max-w-3xl">
          <span className="lk-eyebrow">{copy.sectionEyebrow}</span>
          <h2 id="pricing-comparison-heading" className="lk-display mt-5 text-3xl md:text-[2.65rem]">
            {copy.sectionTitle}
          </h2>
          <p className="lk-lead mt-4 text-base md:text-lg">{copy.sectionLead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#5EEAD4]/50 bg-[#B2F5EA]/30 px-5 py-3.5 text-sm font-bold text-[#212129] md:text-base">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B2F5EA] text-base" aria-hidden>
                ✓
              </span>
              {copy.trustNoCode}
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#C4B5FD]/50 bg-[#D6BCFA]/28 px-5 py-3.5 text-sm font-bold text-[#212129] md:text-base">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D6BCFA] text-base" aria-hidden>
                ⚡
              </span>
              {copy.trustLiveFast}
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#EFA188]/55 bg-[#EFA188]/28 px-5 py-3.5 text-sm font-bold text-[#212129] md:text-base">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white" aria-hidden>
                0%
              </span>
              {copy.zeroCommission}
            </span>
          </div>
        </div>

        <div className="mt-12 rounded-[1.35rem] border-2 border-[#EFA188]/30 bg-white p-6 md:p-8">
          <h3 className="lk-display text-xl md:text-2xl">{copy.replacementTitle}</h3>
          <p className="lk-lead mt-3 max-w-3xl text-sm md:text-base">{copy.replacementLead}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {copy.replacementBullets.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-800"
              >
                <span className="text-neutral-400" aria-hidden>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="compare" className="scroll-mt-28 pt-14 md:pt-18">
          <h3 className="lk-heading text-2xl md:text-3xl">{copy.compareTitle}</h3>
          <p className="lk-lead mt-3 max-w-3xl text-base md:text-lg">{copy.compareLead}</p>

          <div className="mt-8 hidden md:block">
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

          <div className="mt-8 flex flex-col gap-4 md:hidden">
            {model.comparisonRows.map((row) => (
              <article key={row.criterion} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h4 className="text-sm font-bold text-neutral-900">{row.criterion}</h4>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#EFA188]">
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
        </div>

        <div className="scroll-mt-28 pt-14 md:pt-18">
          <div className="max-w-3xl">
            <span className="lk-eyebrow">{copy.pricingEyebrow}</span>
            <h3 className="lk-display mt-5 text-3xl md:text-[2.65rem]">{copy.pricingTitle}</h3>
            <p className="lk-lead mt-4 text-base md:text-lg">{copy.pricingLead}</p>
          </div>

          <PricingGrid model={model} basePath={basePath} locale={locale} />
        </div>
      </div>
    </section>
  );
}
