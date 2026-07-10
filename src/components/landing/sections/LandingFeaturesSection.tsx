import { BentoFeatureCard } from "@/components/landing/BentoFeatureCard";
import { FeaturesFlowSchema } from "@/components/landing/FeaturesFlowSchema";
import {
  IconChart,
  IconLink,
  IconMessage,
  IconMic,
  IconShield,
} from "@/components/landing/Icons";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { renderLandingSectionTitle } from "@/components/landing/renderLandingSectionTitle";
import type { FeaturesFlowDictionary } from "@/i18n/types";
import type { LandingFeaturesDictionary } from "@/i18n/landing/types";

type LandingFeaturesSectionProps = {
  content: LandingFeaturesDictionary;
  flow: FeaturesFlowDictionary;
};

const FEATURE_ICONS = [
  <IconMic key="mic" className="h-5 w-5" />,
  <IconChart key="chart" className="h-5 w-5" />,
  <IconMessage key="message" className="h-5 w-5" />,
  <IconLink key="link" className="h-5 w-5" />,
  <IconShield key="shield" className="h-5 w-5" />,
] as const;

const FEATURE_TINTS = ["peach", "mint", "peach", "lavender", "mint"] as const;

const FEATURE_COL_SPAN = [
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
] as const;

export function LandingFeaturesSection({ content, flow }: LandingFeaturesSectionProps) {
  return (
    <section
      id="features"
      className="landing-features lk-section-alt scroll-mt-28"
      aria-labelledby="features-heading"
    >
      <div className="landing-features-inner mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="features-heading"
          title={renderLandingSectionTitle(content.header)}
          lead={content.header.lead}
        />

        <FeaturesFlowSchema flow={flow} />

        <div className="landing-features-bento lk-frame mt-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-4">
            {content.cards.map((card, index) => (
              <BentoFeatureCard
                key={card.title}
                className={FEATURE_COL_SPAN[index]}
                eyebrow={card.eyebrow}
                title={card.title}
                description={card.description}
                icon={FEATURE_ICONS[index]}
                tint={FEATURE_TINTS[index]}
              />
            ))}
            <div className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#EFA188]/40 bg-gradient-to-br from-[#EFA188]/35 via-[#D6BCFA]/22 to-[#B2F5EA]/28 p-6 md:col-span-6 md:p-8">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#EFA188]/20 blur-3xl"
                aria-hidden
              />
              <div className="relative grid gap-8 md:grid-cols-2 md:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#212129]/60">
                    {content.formBlock.eyebrow}
                  </p>
                  <p className="lk-display mt-4 text-xl md:text-2xl">
                    {content.formBlock.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
                    {content.formBlock.description}
                  </p>
                </div>
                <div className="grid gap-2">
                  {content.formBlock.fields.map((field) => (
                    <div
                      key={field}
                      className="rounded-xl border-2 border-white/80 bg-white/90 px-4 py-3 text-sm font-semibold text-[#212129]"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
