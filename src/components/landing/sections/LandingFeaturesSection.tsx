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
  return (
    <section
      id="features"
      className="lk-section-alt scroll-mt-28"
      aria-labelledby="features-heading"
    >
      <div className="lk-container lk-section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="lk-eyebrow">{content.eyebrow}</span>
          <h2
            id="features-heading"
            className="lk-display mt-5 text-[1.85rem] sm:text-3xl md:text-4xl lg:text-[2.65rem]"
          >
            {content.title}
          </h2>
          <p className="lk-lead mt-4 text-base md:text-lg">{content.lead}</p>
          <hr className="lk-paint-rule mx-auto mt-8" aria-hidden />
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {content.cards.map((card) => (
            <li
              key={card.index}
              className="lk-card group flex flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[#efa188]/35 md:p-8"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#efa188]/15 text-xs font-bold tracking-[0.08em] text-[#e08a6f]">
                {card.index}
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-black md:text-xl">
                {card.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-500 md:text-[0.95rem]">
                {card.description}
              </p>
            </li>
          ))}
        </ul>

        <LandingCompareCards compare={compare} />
      </div>
    </section>
  );
}
