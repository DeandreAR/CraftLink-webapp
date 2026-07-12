import Image from "next/image";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { renderLandingSectionTitle } from "@/components/landing/renderLandingSectionTitle";
import type { LandingControlDictionary } from "@/i18n/landing/types";
import { LANDING_CONTROL_ILLUSTRATION } from "@/lib/landing/landingImages";

type LandingControlSectionProps = {
  content: LandingControlDictionary;
};

const STEP_ACCENTS = [
  "border-l-neutral-300 bg-neutral-50/80",
  "border-l-[#EFA188] bg-[#EFA188]/10",
  "border-l-[#5EEAD4] bg-[#B2F5EA]/15",
] as const;

export function LandingControlSection({ content }: LandingControlSectionProps) {
  const { compare } = content;

  return (
    <section
      id="controle"
      className="landing-control lk-section-warm relative scroll-mt-28 overflow-hidden"
      aria-labelledby="control-heading"
    >
      <figure
        className="pointer-events-none absolute -right-2 top-10 z-0 hidden sm:block md:top-12 lg:right-4 lg:top-14 xl:right-8"
        aria-hidden
      >
        <Image
          src={LANDING_CONTROL_ILLUSTRATION}
          alt=""
          width={1024}
          height={1024}
          className="h-auto w-[14rem] object-contain opacity-90 sm:w-[17rem] md:w-[20rem] lg:w-[24rem] xl:w-[28rem]"
          sizes="(max-width: 640px) 224px, (max-width: 1024px) 320px, 448px"
          priority={false}
        />
      </figure>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="control-heading"
          title={renderLandingSectionTitle(content.header)}
          lead={content.header.lead}
        />

        <div className="mt-10 md:mt-12">
          <p className="lk-eyebrow">{compare.eyebrow}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-neutral-200 bg-neutral-50/90 p-5 md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                {compare.without.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                {compare.without.title}
              </p>
            </article>
            <article className="rounded-2xl border-2 border-[#212129] bg-white p-5 md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EFA188]">
                {compare.with.label}
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-900 md:text-base">
                {compare.with.title}
              </p>
            </article>
          </div>
        </div>

        <ol className="mt-10 space-y-4 md:mt-12">
          {content.steps.map((step, index) => (
            <li
              key={step.title}
              className={`rounded-2xl border border-[#212129]/8 border-l-[5px] p-5 md:p-6 ${STEP_ACCENTS[index] ?? STEP_ACCENTS[0]}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                {step.index}
              </p>
              <h3 className="lk-display mt-2 text-lg md:text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6478] md:text-base">
                {step.lead}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <span className="sr-only">{content.imageAlt}</span>
    </section>
  );
}
