import type { MetierLandingStep } from "@/lib/seo/metierLandingTypes";

const TIMELINE_OFFSETS = [
  "ml-0 md:ml-2",
  "ml-6 md:ml-20 lg:ml-28",
  "ml-3 md:ml-10 lg:ml-14",
] as const;

const TIMELINE_WIDTHS = ["max-w-xl", "max-w-2xl", "max-w-xl"] as const;

type MetierLandingStepsProps = {
  steps: MetierLandingStep[];
};

export function MetierLandingSteps({ steps }: MetierLandingStepsProps) {
  return (
    <div className="relative mt-12 md:mt-16">
      <div
        className="absolute bottom-8 left-[0.75rem] top-6 w-0.5 rounded-full bg-gradient-to-b from-[#EFA188]/25 via-[#EFA188] to-[#212129]/25 md:left-6"
        aria-hidden
      />
      <ol className="space-y-10 md:space-y-14 lg:space-y-20">
        {steps.map((step, index) => (
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
  );
}
