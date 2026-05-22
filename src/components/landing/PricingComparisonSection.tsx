import { PricingGrid } from "@/components/landing/PricingGrid";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type PricingComparisonSectionProps = {
  model: PricingSectionModel;
  basePath: string;
};

export function PricingComparisonSection({
  model,
  basePath,
}: PricingComparisonSectionProps) {
  const { copy } = model;

  return (
    <section
      className="scroll-mt-28 border-t border-neutral-200 bg-neutral-50"
      aria-labelledby="pricing-comparison-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
            {copy.sectionEyebrow}
          </p>
          <h2
            id="pricing-comparison-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
          >
            {copy.sectionTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
            {copy.sectionLead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#B2F5EA] bg-[#B2F5EA]/35 px-5 py-3.5 text-sm font-bold tracking-tight text-neutral-900 shadow-[0_10px_28px_rgba(178,245,234,0.45)] md:text-base">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5EEAD4] text-base"
                aria-hidden
              >
                ✓
              </span>
              {copy.trustNoCode}
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#D6BCFA] bg-[#D6BCFA]/35 px-5 py-3.5 text-sm font-bold tracking-tight text-neutral-900 shadow-[0_10px_28px_rgba(214,188,250,0.4)] md:text-base">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C4B5FD] text-base"
                aria-hidden
              >
                ⚡
              </span>
              {copy.trustLiveFast}
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#EFA188] bg-[#EFA188]/40 px-5 py-3.5 text-sm font-bold tracking-tight text-black shadow-[0_10px_28px_rgba(239,161,136,0.45)] md:text-base">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white"
                aria-hidden
              >
                0%
              </span>
              {copy.zeroCommission}
            </span>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:p-8">
          <h3 className="text-xl font-bold tracking-tight text-black md:text-2xl">
            {copy.replacementTitle}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700 md:text-base">
            {copy.replacementLead}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {copy.replacementBullets.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-2xl border border-neutral-100 bg-neutral-50/80 px-4 py-3 text-sm font-medium text-neutral-900"
              >
                <span className="font-bold text-neutral-400" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="compare" className="scroll-mt-28 pt-14 md:pt-18">
          <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
            {copy.compareTitle}
          </h3>
          <p className="mt-3 max-w-3xl text-base text-neutral-700 md:text-lg">
            {copy.compareLead}
          </p>

          <div className="mt-8 hidden md:block">
            <div className="overflow-hidden rounded-2xl border-2 border-black shadow-[0_18px_44px_rgba(0,0,0,0.08)]">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-black bg-white">
                    <th className="px-4 py-4 font-semibold text-black md:px-6">
                      {copy.tableCriterion}
                    </th>
                    <th className="px-4 py-4 font-semibold text-black md:px-6">
                      {copy.tableClassic}
                    </th>
                    <th className="border-l-4 border-[#EFA188] bg-[#EFA188]/10 px-4 py-4 font-semibold text-black md:px-6">
                      {copy.tableCraftlink}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {model.comparisonRows.map((row) => (
                    <tr key={row.criterion}>
                      <td className="px-4 py-4 font-medium text-black md:px-6">
                        {row.criterion}
                      </td>
                      <td className="px-4 py-4 text-neutral-700 md:px-6">
                        {row.classic}
                      </td>
                      <td className="border-l-4 border-[#EFA188]/70 bg-[#EFA188]/[0.07] px-4 py-4 text-neutral-900 md:px-6">
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
              <article
                key={row.criterion}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <h4 className="text-sm font-bold text-black">{row.criterion}</h4>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#EFA188]">
                      {copy.mobileClassicShort}
                    </p>
                    <p className="mt-1 leading-relaxed text-neutral-700">
                      {row.classic}
                    </p>
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

        <div id="tarifs" className="scroll-mt-28 pt-14 md:pt-18">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              {copy.pricingEyebrow}
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl">
              {copy.pricingTitle}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
              {copy.pricingLead}
            </p>
          </div>

          <PricingGrid model={model} basePath={basePath} />
        </div>
      </div>
    </section>
  );
}
