import Image from "next/image";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { renderLandingSectionTitle } from "@/components/landing/renderLandingSectionTitle";
import type { LandingControlDictionary } from "@/i18n/landing/types";
import { LANDING_CONTROL_ILLUSTRATION } from "@/lib/landing/landingImages";

type LandingControlSectionProps = {
  content: LandingControlDictionary;
};

const TIMELINE_OFFSETS = [
  "ml-0 md:ml-2",
  "ml-6 md:ml-20 lg:ml-28",
  "ml-3 md:ml-10 lg:ml-14",
] as const;

const TIMELINE_WIDTHS = ["max-w-xl", "max-w-2xl", "max-w-xl"] as const;

export function LandingControlSection({ content }: LandingControlSectionProps) {
  const { compare } = content;

  return (
    <section
      id="controle"
      className="landing-control lk-section-warm relative scroll-mt-28 overflow-hidden"
      aria-labelledby="control-heading"
    >
      <figure
        className="pointer-events-none absolute -right-4 top-16 z-0 hidden opacity-85 md:block lg:right-0 lg:top-20"
        aria-hidden
      >
        <Image
          src={LANDING_CONTROL_ILLUSTRATION}
          alt=""
          width={1024}
          height={1024}
          className="h-auto w-[12rem] object-contain lg:w-[22rem] xl:w-[26rem]"
          sizes="(max-width: 1024px) 192px, 416px"
          priority={false}
        />
      </figure>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="control-heading"
          title={renderLandingSectionTitle(content.header)}
          lead={content.header.lead}
        />

        <div className="mt-12 md:mt-14">
          <p className="lk-eyebrow">{compare.eyebrow}</p>

          <div className="relative mt-8 grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
            <article className="relative rotate-[-0.8deg] rounded-[1.5rem] border-[3px] border-red-500 bg-gradient-to-br from-red-100 via-red-50 to-red-200/90 p-6 shadow-[0_20px_56px_rgba(185,28,28,0.22)] md:p-8 md:pr-10">
              <span
                className="inline-flex rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white"
                aria-hidden
              >
                {compare.without.label}
              </span>
              <p className="mt-4 text-lg font-black leading-snug text-red-950 md:text-xl">
                {compare.without.title}
              </p>
              <ul className="mt-5 space-y-3">
                {compare.without.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm font-medium leading-relaxed text-red-900 md:text-base"
                  >
                    <span
                      className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                        <path
                          d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="relative z-10 -mt-2 rotate-[0.6deg] rounded-[1.5rem] border-[3px] border-[#212129] bg-gradient-to-br from-white via-[#FFF5F0] to-[#B2F5EA]/30 p-6 shadow-[0_28px_72px_rgba(239,161,136,0.38)] md:-mt-6 md:p-8 md:pl-10">
              <div
                className="pointer-events-none absolute inset-x-5 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-[#EFA188] via-[#B2F5EA] to-[#D6BCFA]"
                aria-hidden
              />
              <span
                className="inline-flex rounded-full bg-[#EFA188] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#212129]"
                aria-hidden
              >
                {compare.with.label}
              </span>
              <p className="mt-4 text-lg font-black leading-snug text-[#212129] md:text-xl">
                {compare.with.title}
              </p>
              <ul className="mt-5 space-y-3">
                {compare.with.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm font-semibold leading-relaxed text-[#212129] md:text-base"
                  >
                    <span
                      className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <div className="relative mt-16 md:mt-20 lg:mt-24">
          <div
            className="absolute bottom-8 left-[0.75rem] top-6 w-0.5 rounded-full bg-gradient-to-b from-[#EFA188]/25 via-[#EFA188] to-[#212129]/25 md:left-6"
            aria-hidden
          />
          <ol className="space-y-10 md:space-y-14 lg:space-y-20">
            {content.steps.map((step, index) => (
              <li
                key={step.title}
                className={`relative ${TIMELINE_OFFSETS[index] ?? TIMELINE_OFFSETS[0]}`}
              >
                <span
                  className="absolute -left-[0.15rem] top-7 z-10 h-4 w-4 rounded-full border-[3px] border-white bg-[#212129] shadow-[0_0_0_4px_rgba(239,161,136,0.5)] md:-left-[0.35rem] md:top-8 md:h-[1.125rem] md:w-[1.125rem]"
                  aria-hidden
                />
                <article
                  className={`ml-9 rounded-2xl border border-[#212129]/10 bg-white/95 p-6 shadow-[0_16px_48px_rgba(33,33,41,0.07)] backdrop-blur-sm md:ml-14 md:p-8 lg:ml-16 ${TIMELINE_WIDTHS[index] ?? TIMELINE_WIDTHS[0]}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#EFA188]">
                    {step.index}
                  </p>
                  <h3 className="lk-display mt-3 text-xl md:text-2xl lg:text-[1.65rem]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#5b6478] md:text-base md:leading-7">
                    {step.lead}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <span className="sr-only">{content.imageAlt}</span>
    </section>
  );
}
