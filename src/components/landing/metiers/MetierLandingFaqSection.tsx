import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import type { MetierLandingLocaleContent } from "@/lib/seo/metierLandingTypes";

type MetierLandingFaqSectionProps = {
  content: MetierLandingLocaleContent;
};

export function MetierLandingFaqSection({ content }: MetierLandingFaqSectionProps) {
  return (
    <section
      id="faq"
      className="lk-section relative scroll-mt-28 py-14 md:py-20"
      aria-labelledby="metier-faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <LandingSectionHeader
          index="03"
          eyebrow={content.faqEyebrow}
          id="metier-faq-heading"
          title={content.faqTitle}
        />
        <div className="mt-10 space-y-3">
          {content.faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-[#212129]/10 bg-white/95 p-1 shadow-[0_8px_24px_rgba(33,33,41,0.05)]"
            >
              <summary className="cursor-pointer list-none rounded-xl px-5 py-4 text-base font-bold text-[#212129] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span
                    className="text-[#EFA188] transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-[#5b6478] md:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
