import type { Locale } from "@/i18n/config";
import type { MetierLandingLocaleContent } from "@/lib/seo/metierLandingTypes";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";

type MetierLandingPainSolutionProps = {
  content: MetierLandingLocaleContent;
  locale: Locale;
};

export function MetierLandingPainSolution({ content, locale }: MetierLandingPainSolutionProps) {
  const beforeLabel = locale === "fr" ? "Avant" : "Before";
  const afterLabel = locale === "fr" ? "Avec CraftLink" : "With CraftLink";
  return (
    <section
      id="controle"
      className="landing-control lk-section relative scroll-mt-28 overflow-hidden py-14 md:py-20"
      aria-labelledby="metier-pain-heading"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <LandingSectionHeader
          index="01"
          eyebrow={content.tradeLabel}
          id="metier-pain-heading"
          title={content.painH2}
          lead={content.painLead}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          <article className="relative rotate-[-0.8deg] rounded-[1.5rem] border-[3px] border-red-500 bg-gradient-to-br from-red-100 via-red-50 to-red-200/90 p-6 shadow-[0_20px_56px_rgba(185,28,28,0.22)] md:p-8">
            <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
              {beforeLabel}
            </span>
            <p className="mt-4 text-lg font-black leading-snug text-red-950 md:text-xl">
              {content.painH2}
            </p>
            <ul className="mt-5 space-y-3">
              {content.painBullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm font-medium leading-relaxed text-red-900 md:text-base"
                >
                  <span
                    className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"
                    aria-hidden
                  >
                    ×
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="relative z-10 -mt-2 rotate-[0.6deg] rounded-[1.5rem] border-[3px] border-[#212129] bg-gradient-to-br from-white via-[#FFF5F0] to-[#B2F5EA]/30 p-6 shadow-[0_28px_72px_rgba(239,161,136,0.38)] md:-mt-6 md:p-8">
            <div
              className="pointer-events-none absolute inset-x-5 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-[#EFA188] via-[#B2F5EA] to-[#D6BCFA]"
              aria-hidden
            />
            <span className="inline-flex rounded-full bg-[#EFA188] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#212129]">
              {afterLabel}
            </span>
            <p className="mt-4 text-lg font-black leading-snug text-[#212129] md:text-xl">
              {content.solutionH2}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6478] md:text-base">
              {content.solutionLead}
            </p>
            <ul className="mt-5 space-y-3">
              {content.solutionBullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm font-semibold leading-relaxed text-[#212129] md:text-base"
                >
                  <span
                    className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
