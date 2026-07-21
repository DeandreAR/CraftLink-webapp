import { HeroAsideShowcase } from "@/components/landing/HeroAsideShowcase";
import { HeroRotatingTitle } from "@/components/landing/HeroRotatingTitle";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeroDiagonalBrush } from "@/components/landing/LandingHeroDiagonalBrush";
import { LandingHeroReveal } from "@/components/landing/LandingHeroReveal";
import { LandingWhatsAppFloat } from "@/components/landing/LandingWhatsAppFloat";
import { Navbar } from "@/components/landing/Navbar";
import { LandingFeaturesSection } from "@/components/landing/sections/LandingFeaturesSection";
import { LandingPricingSection } from "@/components/landing/sections/LandingPricingSection";
import { onboardingPath } from "@/lib/auth/paths";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPricingSectionModel } from "@/services/pricingComparisonSection";

export async function LandingHome({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const basePath = lang === defaultLocale ? "" : `/${lang}`;
  const pricingModel = buildPricingSectionModel(dict.pricingComparison);
  const { landing, hero, features } = dict;

  return (
    <div className="landing-page landing-home min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar lang={lang} labels={dict.nav} hiddenSections={["metiers"]} />
      <LandingWhatsAppFloat lang={lang} />

      <main className="landing-main relative max-md:pb-20">
        {/* ——— Hero OpenShip + brush background ——— */}
        <section className="landing-hero relative flex min-h-[100dvh] flex-col justify-center overflow-hidden border-b border-zinc-200/80 bg-zinc-50">
          <LandingHeroDiagonalBrush variant="hero" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <div className="min-w-0">
                <LandingHeroReveal>
                  <div className="max-w-xl rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] backdrop-blur-sm md:p-8">
                    <p className="inline-flex items-center rounded-full border border-[#efa188]/20 bg-[#efa188]/10 px-3.5 py-1.5 text-xs font-medium text-[#efa188]">
                      {hero.pill}
                    </p>
                    <HeroRotatingTitle
                      className="landing-hero-title mt-4 !text-3xl sm:!text-4xl md:!text-[2.75rem] lg:!text-[3.1rem]"
                      before={hero.titleBefore}
                      words={hero.rotatingWords}
                      after={hero.titleAfter}
                    />
                  </div>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.1}>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-500 md:text-lg">
                    {hero.lead}
                  </p>
                  <p className="mt-3 max-w-lg text-base font-medium leading-relaxed text-zinc-800 md:text-[0.9375rem]">
                    {hero.controlPhrase}
                  </p>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.14}>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <LandingCta href={onboardingPath(lang)} variant="peach">
                      {hero.ctaPrimary}
                    </LandingCta>
                    <LandingCta
                      href={`${basePath}${hero.ctaSecondaryHref}`}
                      variant="secondary"
                    >
                      {hero.ctaSecondary}
                    </LandingCta>
                  </div>
                </LandingHeroReveal>
              </div>

              <LandingHeroReveal delay={0.12} className="min-w-0">
                <div id="preview" className="w-full">
                  <HeroAsideShowcase
                    alt={hero.asideShowcaseAlt}
                    copy={hero.asideShowcase}
                    className="w-full"
                  />
                </div>
              </LandingHeroReveal>
            </div>
          </div>
        </section>

        <LandingFeaturesSection
          content={features}
          compare={landing.control.compare}
        />

        <LandingPricingSection
          model={pricingModel}
          basePath={basePath}
          locale={lang}
        />

        {/* ——— CTA final ——— */}
        <section id="cta" className="lk-section-alt scroll-mt-28">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="lk-card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-xl">
                <h2 className="lk-display text-2xl text-zinc-900 md:text-3xl">
                  {landing.cta.title}{" "}
                  <span className="text-[#efa188]">{landing.cta.titleHighlight}</span>
                </h2>
                <p className="mt-3 text-base text-zinc-500">{landing.cta.lead}</p>
              </div>
              <LandingCta
                href={onboardingPath(lang)}
                variant="peach"
                className="shrink-0"
              >
                {landing.cta.button}
              </LandingCta>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter lang={lang} footer={dict.footer} />
    </div>
  );
}
