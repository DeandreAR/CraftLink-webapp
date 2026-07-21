import type { LandingFeaturesDictionary } from "@/i18n/types";

type LandingFeaturesSectionProps = {
  content: LandingFeaturesDictionary;
};

export function LandingFeaturesSection({ content }: LandingFeaturesSectionProps) {
  return (
    <section
      id="features"
      className="lk-section-alt scroll-mt-28"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="lk-eyebrow">{content.eyebrow}</span>
          <h2
            id="features-heading"
            className="lk-display mt-5 text-3xl text-zinc-900 md:text-4xl"
          >
            {content.title}
          </h2>
          <p className="mt-4 text-base text-zinc-500 md:text-lg">{content.lead}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {content.cards.map((card) => (
            <li key={card.index} className="lk-card flex flex-col p-6 md:p-8">
              <span className="text-xs font-semibold tracking-[0.14em] text-[#efa188]">
                {card.index}
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 md:text-[0.9375rem]">
                {card.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
