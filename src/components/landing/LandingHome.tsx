import { HeroAsideShowcase } from "@/components/landing/HeroAsideShowcase";
import { HeroTypingChannels } from "@/components/landing/HeroTypingChannels";
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
    <div className="landing-page landing-home min-h-screen bg-white text-black">
      <Navbar lang={lang} labels={dict.nav} hiddenSections={["metiers"]} />
      <LandingWhatsAppFloat lang={lang} />

      <main className="landing-main relative max-md:pb-24">
        <section className="landing-hero relative flex min-h-[min(100dvh,920px)] flex-col justify-center overflow-hidden bg-white">
          <LandingHeroDiagonalBrush variant="hero" />

          <div className="lk-container relative z-10 pb-16 pt-10 md:pb-24 md:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
              <div className="min-w-0 text-center lg:text-left">
                <LandingHeroReveal>
                  <p className="lk-eyebrow">{hero.pill}</p>
                  <h1 className="lk-display landing-hero-title mt-5 text-[2rem] leading-[1.08] text-black sm:text-[2.5rem] md:text-[3rem] lg:text-[3.35rem]">
                    {hero.title}
                  </h1>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.08}>
                  <p className="lk-lead mx-auto mt-6 max-w-lg text-base md:text-lg lg:mx-0">
                    {hero.lead}
                  </p>
                  <p className="mx-auto mt-3 max-w-lg text-base font-semibold leading-relaxed text-black md:text-[1.05rem] lg:mx-0">
                    {hero.controlPhrase}{" "}
                    <HeroTypingChannels
                      intro={hero.typingTitle.intro}
                      channels={hero.typingTitle.channels}
                    />
                  </p>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.12}>
                  <div className="mt-9 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-md sm:flex-row sm:items-center lg:mx-0 lg:max-w-none">
                    <LandingCta
                      href={onboardingPath(lang)}
                      variant="primary"
                      className="w-full sm:w-auto sm:min-w-[12.5rem]"
                    >
                      {hero.ctaPrimary}
                    </LandingCta>
                    <LandingCta
                      href={`${basePath}${hero.ctaSecondaryHref}`}
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      {hero.ctaSecondary}
                    </LandingCta>
                  </div>
                </LandingHeroReveal>
              </div>

              <LandingHeroReveal delay={0.1} className="min-w-0">
                <div id="preview" className="mx-auto w-full max-w-md lg:max-w-none">
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

        <section id="cta" className="lk-section-alt scroll-mt-28">
          <div className="lk-container lk-section-pad">
            <div className="lk-card relative overflow-hidden px-6 py-10 md:px-12 md:py-14">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,161,136,0.18),transparent_55%)]"
                aria-hidden
              />
              <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="lk-display text-[1.75rem] md:text-3xl lg:text-[2.15rem]">
                    {landing.cta.title}{" "}
                    <span className="text-[#efa188]">{landing.cta.titleHighlight}</span>
                  </h2>
                  <p className="lk-lead mt-3 text-base md:text-lg">{landing.cta.lead}</p>
                </div>
                <LandingCta
                  href={onboardingPath(lang)}
                  variant="primary"
                  className="w-full shrink-0 sm:w-auto"
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
