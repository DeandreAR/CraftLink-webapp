import { LandingCompareCards } from "@/components/landing/sections/LandingCompareCards";
import type { LandingControlDictionary } from "@/i18n/landing/types";
import type { LandingFeaturesDictionary } from "@/i18n/types";

type LandingFeaturesSectionProps = {
  content: LandingFeaturesDictionary;
  compare: LandingControlDictionary["compare"];
};

export function LandingFeaturesSection({
  content,
  compare,
}: LandingFeaturesSectionProps) {
  const { reassurance } = content;

  return (
    <section
      id="features"
      className="scroll-mt-28 bg-slate-50"
      aria-labelledby="features-heading"
    >
      <div className="lk-container lk-section-pad">
        <LandingCompareCards compare={compare} />

        <div className="mx-auto mt-16 max-w-2xl text-center md:mt-24">
          <span className="lk-eyebrow">{content.eyebrow}</span>
          <h2
            id="features-heading"
            className="lk-display mt-5 text-[1.85rem] text-slate-900 sm:text-3xl md:text-4xl lg:text-[2.65rem]"
          >
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            {content.lead}
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {content.cards.map((card) => (
            <li
              key={card.index}
              className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#efa188]/40 md:p-8"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#efa188]/15 text-xs font-bold tracking-[0.08em] text-[#e08a6f]">
                {card.index}
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
                {card.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 md:text-[0.95rem]">
                {card.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:mt-20 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="lk-eyebrow">{reassurance.eyebrow}</span>
            <h3 className="lk-display mt-4 text-[1.5rem] text-slate-900 md:text-2xl lg:text-[1.85rem]">
              {reassurance.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              {reassurance.lead}
            </p>
            <p className="mt-5 text-base font-semibold leading-snug text-slate-900 md:text-lg">
              {reassurance.message}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
