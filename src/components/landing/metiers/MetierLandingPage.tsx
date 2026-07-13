import { HeroAsideShowcase } from "@/components/landing/HeroAsideShowcase";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeroDiagonalBrush } from "@/components/landing/LandingHeroDiagonalBrush";
import { LandingHeroReveal } from "@/components/landing/LandingHeroReveal";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { LandingWhatsAppFloat } from "@/components/landing/LandingWhatsAppFloat";
import { Navbar } from "@/components/landing/Navbar";
import { MetierLandingFaqSection } from "@/components/landing/metiers/MetierLandingFaqSection";
import { MetierLandingPainSolution } from "@/components/landing/metiers/MetierLandingPainSolution";
import { MetierLandingSteps } from "@/components/landing/metiers/MetierLandingSteps";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { onboardingPath } from "@/lib/auth/paths";
import { buildMetierLandingJsonLd } from "@/lib/seo/metierLandingJsonLd";
import {
  metierLandingPath,
} from "@/lib/seo/metierLandingPages";
import type { MetierLandingPageEntry } from "@/lib/seo/metierLandingTypes";

type MetierLandingPageProps = {
  lang: Locale;
  entry: MetierLandingPageEntry;
};

export async function MetierLandingPage({ lang, entry }: MetierLandingPageProps) {
  const dict = await getDictionary(lang);
  const content = entry.content[lang];
  const path = metierLandingPath(entry, lang);
  const signupHref = onboardingPath(lang, { metierKey: entry.metierKey });
  const jsonLd = buildMetierLandingJsonLd({ path, content });

  return (
    <div className="landing-page landing-metier min-h-screen bg-[#FDFBF7] text-[#212129]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar lang={lang} labels={dict.nav} />
      <LandingWhatsAppFloat lang={lang} />

      <main className="landing-main relative max-md:pb-20">
        <section className="landing-hero relative flex min-h-[92dvh] flex-col justify-center overflow-visible bg-[#FDFBF7]">
          <LandingHeroDiagonalBrush variant="hero" />

          <div className="landing-hero-inner relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-20 md:px-6 md:pb-18 md:pt-24">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-x-12">
              <div className="min-w-0">
                <LandingHeroReveal>
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700">
                    <span className="h-2 w-2 rounded-full bg-[#EFA188]" />
                    {content.heroPill}
                  </p>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.08}>
                  <div className="relative z-10 mt-6 max-w-2xl rounded-2xl bg-white/95 p-7 shadow-xl backdrop-blur-sm md:p-9">
                    <h1 className="lk-display text-3xl leading-tight md:text-[2.35rem] lg:text-[2.65rem]">
                      {content.h1}
                    </h1>
                  </div>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.14}>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                    {content.heroLead}
                  </p>
                  <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-neutral-900">
                    {content.heroHighlight}
                  </p>
                </LandingHeroReveal>

                <LandingHeroReveal delay={0.2}>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <LandingCta href={signupHref} variant="peach">
                      {content.ctaButton}
                    </LandingCta>
                    <LandingCta href={lang === defaultLocale ? "/#controle" : `/${lang}#controle`} variant="secondary">
                      {lang === "fr" ? "Voir comment ça marche" : "See how it works"}
                    </LandingCta>
                  </div>
                </LandingHeroReveal>
              </div>

              <LandingHeroReveal className="flex min-w-0 items-center justify-center" delay={0.18}>
                <HeroAsideShowcase
                  alt={dict.hero.asideShowcaseAlt}
                  copy={dict.hero.asideShowcase}
                  className="w-full"
                />
              </LandingHeroReveal>
            </div>
          </div>
        </section>

        <MetierLandingPainSolution content={content} locale={lang} />

        <section className="lk-section-warm relative scroll-mt-28 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <LandingSectionHeader
              index="02"
              eyebrow={content.stepsEyebrow}
              id="metier-steps-heading"
              title={content.stepsTitle}
              lead={content.stepsLead}
            />
            <MetierLandingSteps steps={content.steps} />
          </div>
        </section>

        <MetierLandingFaqSection content={content} />

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
                    {content.ctaTitle}{" "}
                    <span className="lk-marker">{content.ctaHighlight}</span> ?
                  </h2>
                  <p className="lk-lead mt-4 text-base md:text-lg">{content.ctaLead}</p>
                </div>
                <LandingCta href={signupHref} variant="peach" className="min-w-[240px] shrink-0">
                  {content.ctaButton}
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
