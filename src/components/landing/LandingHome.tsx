import { HeroAsideShowcase } from "@/components/landing/HeroAsideShowcase";
import { HeroTypingTitle } from "@/components/landing/HeroTypingTitle";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFaqDisclosure } from "@/components/landing/LandingFaqDisclosure";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeroDiagonalBrush } from "@/components/landing/LandingHeroDiagonalBrush";
import { LandingHeroReveal } from "@/components/landing/LandingHeroReveal";
import { LandingWhatsAppFloat } from "@/components/landing/LandingWhatsAppFloat";
import { Navbar } from "@/components/landing/Navbar";
import { PricingComparisonSection } from "@/components/landing/PricingComparisonSection";
import { LandingControlSection } from "@/components/landing/sections/LandingControlSection";
import { LandingMetiersSection } from "@/components/landing/sections/LandingMetiersSection";
import { onboardingPath } from "@/lib/auth/paths";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPricingSectionModel } from "@/services/pricingComparisonSection";

export async function LandingHome({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const basePath = lang === defaultLocale ? "" : `/${lang}`;
  const pricingModel = buildPricingSectionModel(dict.pricingComparison);
  const { landing } = dict;

  return (
    <div className="landing-page landing-home min-h-screen bg-[#FDFBF7] text-[#212129]">
      <Navbar lang={lang} labels={dict.nav} />
      <LandingWhatsAppFloat lang={lang} />

      <main className="landing-main relative max-md:pb-20">
        <section className="landing-hero relative flex min-h-[100dvh] flex-col justify-center overflow-visible bg-[#FDFBF7]">
          <LandingHeroDiagonalBrush variant="hero" />

          <div className="landing-hero-inner relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-20 md:px-6 md:pb-18 md:pt-24">
            <div className="landing-hero-body grid items-start gap-10 md:gap-8">
              <div className="landing-hero-body-col min-w-0">
                <LandingHeroReveal>
                  <p className="landing-hero-pill inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700 md:text-[10px] md:tracking-[0.14em] lg:text-xs lg:tracking-[0.18em]">
                    <span className="h-2 w-2 rounded-full bg-[#EFA188]" />
                    {dict.hero.pill}
                  </p>
                </LandingHeroReveal>

                <div className="landing-hero-grid mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,1.12fr)] lg:gap-x-10">
                  <div className="landing-hero-copy min-w-0 w-full lg:max-w-none">
                    <LandingHeroReveal delay={0.08}>
                      <div className="landing-hero-title-card relative z-10 mb-6 max-w-2xl rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-8 lg:p-10">
                        <HeroTypingTitle
                          className="landing-hero-title"
                          intro={dict.hero.typingTitle.intro}
                          channels={dict.hero.typingTitle.channels}
                        />
                      </div>
                    </LandingHeroReveal>
                    <LandingHeroReveal delay={0.14}>
                      <p className="landing-hero-lead mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 md:max-w-none md:text-[0.9375rem] lg:text-lg">
                        {dict.hero.lead}
                      </p>
                      <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-neutral-900 md:max-w-none md:text-[0.9375rem] lg:text-base">
                        {dict.hero.controlPhrase}
                      </p>
                    </LandingHeroReveal>

                    <LandingHeroReveal delay={0.2}>
                      <div className="landing-hero-ctas mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <LandingCta href={onboardingPath(lang)} variant="peach">
                          {dict.hero.ctaPrimary}
                        </LandingCta>
                        <LandingCta
                          href={`${basePath}${dict.hero.ctaSecondaryHref}`}
                          variant="secondary"
                        >
                          {dict.hero.ctaSecondary}
                        </LandingCta>
                      </div>
                    </LandingHeroReveal>
                  </div>

                  <LandingHeroReveal
                    className="landing-hero-aside flex min-w-0 w-full items-center justify-center overflow-visible scroll-mt-28 lg:py-2"
                    delay={0.18}
                  >
                    <div id="preview" className="w-full">
                      <HeroAsideShowcase
                      alt={dict.hero.asideShowcaseAlt}
                      copy={dict.hero.asideShowcase}
                      className="w-full"
                    />
                    </div>
                  </LandingHeroReveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingControlSection content={landing.control} />

        <LandingMetiersSection content={landing.metiers} />

        <PricingComparisonSection model={pricingModel} basePath={basePath} locale={lang} />

        <LandingFaqDisclosure blocks={landing.faqBlocks} copy={dict.faqUi} />

        <section
          id="cta"
          className="landing-cta relative isolate scroll-mt-28 overflow-x-clip overflow-y-hidden bg-[#FDFBF7] py-20 md:py-24"
        >
          <LandingHeroDiagonalBrush variant="cta" />
          <div className="landing-cta-inner relative z-10 mx-auto max-w-6xl px-4 md:px-6">
            <div className="rounded-[1.75rem] border-2 border-[#212129] bg-white/95 p-8 shadow-[0_24px_64px_rgba(33,33,41,0.1)] backdrop-blur-sm md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="lk-section-index !mb-2 !text-[3rem] md:!text-[4rem]" aria-hidden>
                    →
                  </p>
                  <h2 className="lk-display text-2xl md:text-4xl">
                    {landing.cta.title}{" "}
                    <span className="lk-marker">{landing.cta.titleHighlight}</span> ?
                  </h2>
                  <p className="lk-lead mt-4 text-base md:text-lg">{landing.cta.lead}</p>
                </div>
                <LandingCta
                  href={onboardingPath(lang)}
                  variant="peach"
                  className="min-w-[240px] shrink-0"
                >
                  {landing.cta.button}
                </LandingCta>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter lang={lang} footer={dict.footer} />
    </div>
  );
}
