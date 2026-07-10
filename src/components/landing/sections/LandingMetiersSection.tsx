import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { renderLandingSectionTitle } from "@/components/landing/renderLandingSectionTitle";
import type { LandingMetiersDictionary } from "@/i18n/landing/types";

type LandingMetiersSectionProps = {
  content: LandingMetiersDictionary;
};

const CARD_STYLES = [
  { border: "border-l-[#EFA188]", bg: "bg-[#EFA188]/10" },
  { border: "border-l-[#5EEAD4]", bg: "bg-[#B2F5EA]/12" },
  { border: "border-l-[#C4B5FD]", bg: "bg-[#D6BCFA]/12" },
] as const;

export function LandingMetiersSection({ content }: LandingMetiersSectionProps) {
  return (
    <section
      id="metiers"
      className="landing-metiers lk-section scroll-mt-28"
      aria-labelledby="metiers-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="metiers-heading"
          title={content.header.title}
          lead={content.header.lead}
        />

        <div className="landing-metiers-grid mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length];
            return (
              <div
                key={card.metier}
                className={`rounded-[1.15rem] border-2 border-[#212129]/8 border-l-[5px] p-6 ${style.border} ${style.bg}`}
              >
                <h3 className="lk-display text-lg">{card.metier}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6478]">{card.angle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
