import {
  IconFolder,
  IconPalette,
  IconShareNetwork,
} from "@/components/landing/Icons";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { PourquoiPillarCard } from "@/components/landing/PourquoiPillarCard";
import { renderLandingSectionTitle } from "@/components/landing/renderLandingSectionTitle";
import type { PourquoiDictionary } from "@/i18n/types";
import type { LandingPourquoiDictionary } from "@/i18n/landing/types";

type LandingPourquoiSectionProps = {
  content: LandingPourquoiDictionary;
  pillars: PourquoiDictionary["pillars"];
};

export function LandingPourquoiSection({
  content,
  pillars,
}: LandingPourquoiSectionProps) {
  return (
    <section
      id="pourquoi"
      className="landing-pourquoi lk-section-warm scroll-mt-28"
      aria-labelledby="pourquoi-heading"
    >
      <div className="landing-pourquoi-inner mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="pourquoi-heading"
          title={renderLandingSectionTitle(content.header)}
          lead={content.header.lead}
        />

        <div className="mt-8 inline-flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#D6BCFA]/50 bg-[#D6BCFA]/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#212129]">
            {content.badge}
          </span>
          <span className="text-sm text-[#5b6478]">{content.badgeHint}</span>
        </div>

        <div className="landing-pourquoi-compare mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-[1.35rem] border-2 border-[#212129]/10 bg-white/70 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {content.without.label}
            </p>
            <p className="mt-3 text-lg font-bold text-neutral-800">{content.without.title}</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-600 md:text-base">
              {content.without.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="text-neutral-400" aria-hidden>
                    —
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.35rem] border-2 border-[#EFA188] bg-[#EFA188]/25 p-6 shadow-[0_16px_48px_rgba(239,161,136,0.18)] md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E08A6F]">
              {content.with.label}
            </p>
            <p className="lk-display mt-3 border-l-4 border-[#212129] pl-4 text-xl md:text-2xl">
              {content.with.title}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              {content.with.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="font-bold text-[#EFA188]" aria-hidden>
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="landing-pourquoi-pillars mt-14 grid gap-4 md:grid-cols-3">
          <PourquoiPillarCard
            pillar={pillars[0]}
            tint="peach"
            icon={<IconPalette className="h-5 w-5" />}
          />
          <PourquoiPillarCard
            pillar={pillars[1]}
            tint="mint"
            icon={<IconShareNetwork className="h-5 w-5" />}
          />
          <PourquoiPillarCard
            pillar={pillars[2]}
            tint="lavender"
            icon={<IconFolder className="h-5 w-5" />}
          />
        </div>
      </div>
    </section>
  );
}
