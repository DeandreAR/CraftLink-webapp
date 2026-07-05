import { Navbar } from "@/components/landing/Navbar";
import { BentoFeatureCard } from "@/components/landing/BentoFeatureCard";
import {
  IconChart,
  IconFolder,
  IconLink,
  IconMessage,
  IconMic,
  IconPalette,
  IconShareNetwork,
  IconShield,
} from "@/components/landing/Icons";
import { LandingFaqDisclosure } from "@/components/landing/LandingFaqDisclosure";
import { HeroAsideShowcase } from "@/components/landing/HeroAsideShowcase";
import { LandingHeroDiagonalBrush } from "@/components/landing/LandingHeroDiagonalBrush";
import { HeroTypingTitle } from "@/components/landing/HeroTypingTitle";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { PricingComparisonSection } from "@/components/landing/PricingComparisonSection";
import { FeaturesFlowSchema } from "@/components/landing/FeaturesFlowSchema";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DemoVideoSection } from "@/components/landing/DemoVideoSection";
import { PourquoiPillarCard } from "@/components/landing/PourquoiPillarCard";
import { onboardingPath } from "@/lib/auth/paths";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPricingSectionModel } from "@/services/pricingComparisonSection";

const faqBlocks = [
  {
    title: "Simplicité et prise en main",
    items: [
      {
        q: "Je ne suis pas à l’aise avec la technologie.",
        a: "CraftLink évite le jargon et les réglages interminables. Vous remplissez l’essentiel sur votre activité, vous récupérez un lien à mettre en bio ou sur une carte. Si vous savez envoyer un message WhatsApp, vous savez utiliser CraftLink.",
      },
      {
        q: "Je n’ai pas le temps de créer un site.",
        a: "La promesse, c’est une page pro prête en quelques minutes — pas un site à construire pendant des semaines. Les sections sont pensées pour les artisans : services, zone, prise de contact. Le reste (vocaux, scoring, WhatsApp) travaille pour vous en coulisse.",
      },
      {
        q: "Combien de temps pour être en ligne ?",
        a: "En règle générale, quelques minutes suffisent pour publier votre lien. Vous pouvez le peaufiner plus tard ; l’important est de commencer à capter les demandes dès que vous le souhaitez.",
      },
    ],
  },
  {
    title: "Prix et retour sur investissement",
    items: [
      {
        q: "C’est trop cher pour moi.",
        a: "Il existe une entrée accessible pour tester sans engagement lourd. L’objectif est de vous faire gagner du temps sur les échanges et d’éviter les chantiers qui ne collent pas — ce qui peut coûter bien plus cher qu’un abonnement.",
      },
    ],
  },
  {
    title: "Fonctionnement concret",
    items: [
      {
        q: "Comment mes clients vous trouvent-ils ?",
        a: "Ils vous trouvent comme aujourd’hui : vos réseaux, votre bouche-à-oreille, vos flyers. La différence, c’est qu’au lieu d’un message vide ou d’un « bonjour », ils passent par votre lien : vous recevez une demande structurée ou un vocal transcrit.",
      },
      {
        q: "Est-ce adapté à mon métier ?",
        a: "CraftLink est pensé pour les artisans et travailleurs du bâtiment : urgences, délais, types d’intervention, zones desservies. Électriciens, plombiers, menuisiers, chauffagistes, serruriers, peintres, maçons… si vous faites des devis, le schéma vous correspond.",
      },
      {
        q: "Est-ce que ça remplace un site web ?",
        a: "Pour beaucoup d’artisans indépendants, c’est suffisant comme vitrine principale : une page claire + capture de leads. Si vous avez déjà un site peu utile, CraftLink peut devenir votre point d’entrée principal. Un site très complet peut rester un complément selon vos ambitions.",
      },
    ],
  },
  {
    title: "Instagram, Facebook et WhatsApp",
    items: [
      {
        q: "Est-ce que ça marche si je n’ai que Facebook ou Instagram ?",
        a: "Oui. Vous placez le même lien partout : bio Instagram, page Facebook, story sauvegardée, QR code sur véhicule ou chantier. Le tunnel fonctionne dès qu’un client clique.",
      },
      {
        q: "Est-ce que je peux garder WhatsApp ?",
        a: "Oui. WhatsApp reste votre canal habituel. CraftLink organise ce qui arrive avant : besoin, zone, urgence, pièces jointes si besoin. Vous ouvrez WhatsApp avec le contexte déjà là.",
      },
    ],
  },
  {
    title: "Sécurité, données et support",
    items: [
      {
        q: "Est-ce que mes données sont sécurisées ?",
        a: "Les informations de vos clients méritent du sérieux : stockage et accès sont conçus dans une logique professionnelle (connexion sécurisée, bonnes pratiques). Consultez notre politique de confidentialité pour le détail de vos droits et de nos engagements RGPD.",
      },
    ],
  },
];

const metiersCasUsage = [
  {
    metier: "Électricien",
    angle:
      "Tableaux, mises aux normes, dépannage : priorisez les urgences et les dossiers complets grâce au scoring.",
  },
  {
    metier: "Plombier / chauffagiste",
    angle:
      "Fuites, chauffe-eau, rénovation salle de bains : laissez le client décrire en vocal ce qu’il voit chez lui.",
  },
  {
    metier: "Menuisier",
    angle:
      "Fenêtres, portes, agencement : récupérez dimensions et inspirations sans douzaines de messages éparpillés.",
  },
  {
    metier: "Serrurier",
    angle:
      "Ouvertures urgentes : identifiez tout de suite la zone et le créneau pour optimiser vos déplacements.",
  },
  {
    metier: "Plaquiste",
    angle:
      "Cloisons, plafonds, isolation : le client décrit pièces et contraintes pour un premier chiffrage plus net.",
  },
  {
    metier: "Peintre",
    angle:
      "Surfaces, finitions, délais : le client précise déjà volumes et contraintes pour chiffrer sans allers-retours interminables.",
  },
  {
    metier: "Paysagiste",
    angle:
      "Entretien, création, arrosage ou piscine : surface, exposition et photos guident votre visite technique et votre proposition.",
  },
  {
    metier: "Couvreur",
    angle:
      "Fuite, réfection ou isolation : le vocal décrit l’étage et l’urgence, vous arrivez avec le bon matériel et le bon créneau.",
  },
  {
    metier: "Carreleur",
    angle:
      "Salle de bains, faïence ou grand format : dimensions et photos limitent les imprécisions avant la pose ou le chiffrage.",
  },
  {
    metier: "Charpentier",
    angle:
      "Ossature, couverture bois ou rénovation : type d’ouvrage et accès chantier sont cadrés avant votre déplacement.",
  },
  {
    metier: "Maçon & artisan BTP",
    angle:
      "Gros œuvre ou rénovation : une entrée unique pour les petits chantiers comme pour les réponses aux appels d’offres locaux.",
  },
];

export async function LandingHome({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const basePath = `/${lang}`;
  const pricingModel = buildPricingSectionModel(dict.pricingComparison);

  return (
    <div className="landing-page landing-home min-h-screen bg-[#FDFBF7] text-[#212129]">
      <Navbar basePath={basePath} labels={dict.nav} />

      <main className="landing-main relative">
        {/* Hero */}
        <section className="landing-hero relative overflow-visible bg-[#FDFBF7]">
          <LandingHeroDiagonalBrush variant="hero" />

          <div className="landing-hero-inner relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-14">
            <div className="landing-hero-body grid items-start gap-10 md:gap-8">
              <div className="landing-hero-body-col min-w-0">
                <p className="landing-hero-pill inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  <span className="h-2 w-2 rounded-full bg-[#EFA188]" />
                  {dict.hero.pill}
                </p>

                <div className="landing-hero-grid mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,1.12fr)] lg:gap-x-6">
                  <div className="landing-hero-copy min-w-0 w-full self-center lg:max-w-none">
                    <div className="landing-hero-title-card relative z-10 mb-6 max-w-2xl rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm md:p-10">
                      <HeroTypingTitle
                        className="landing-hero-title"
                        intro={dict.hero.typingTitle.intro}
                        channels={dict.hero.typingTitle.channels}
                      />
                    </div>
                    <p className="landing-hero-lead mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 md:max-w-none md:text-lg">
                      {dict.hero.lead}
                    </p>
                    <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-neutral-900 md:max-w-none">
                      {dict.hero.controlPhrase}
                    </p>

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
                  </div>

                  <div
                    id="preview"
                    className="landing-hero-aside flex min-w-0 w-full items-center justify-center overflow-visible scroll-mt-28"
                  >
                    <HeroAsideShowcase
                      alt={dict.hero.asideShowcaseAlt}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DemoVideoSection copy={dict.demoVideo} />

        {/* Pourquoi */}
        <section
          id="pourquoi"
          className="landing-pourquoi lk-section-warm scroll-mt-28"
          aria-labelledby="pourquoi-heading"
        >
          <div className="landing-pourquoi-inner mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <LandingSectionHeader
              index="01"
              eyebrow="Pourquoi CraftLink ?"
              id="pourquoi-heading"
              title={
                <>
                  Une entrée qui{" "}
                  <span className="lk-marker">clarifie le besoin</span>, pas une vitrine de plus.
                </>
              }
              lead="Quand les sollicitations arrivent en rafale depuis plusieurs canaux, le vrai goulot d’étranglement n’est pas le manque de visibilité : c’est l’absence de cadre. CraftLink impose un parcours court et lisible — vous gardez la main sur le moment où vous rappelez, avec un dossier déjà exploitable."
            />

            <div className="mt-8 inline-flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#D6BCFA]/50 bg-[#D6BCFA]/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#212129]">
                Zéro maintenance · Évolutif
              </span>
              <span className="text-sm text-[#5b6478]">
                Mises à jour et nouveautés côté produit, sans charge pour vous.
              </span>
            </div>

            <div className="landing-pourquoi-compare mt-14 grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.35rem] border-2 border-[#212129]/10 bg-white/70 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Sans CraftLink
                </p>
                <p className="mt-3 text-lg font-bold text-neutral-800">
                  Le flou des canaux mélangés
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-600 md:text-base">
                  <li className="flex gap-2">
                    <span className="text-neutral-400" aria-hidden>—</span>
                    Fils DM, mails et SMS qui ne se recoupent pas : le contexte
                    saute entre deux notifications.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-400" aria-hidden>—</span>
                    Même question posée cinq fois pour obtenir commune, budget ou
                    niveau d’urgence.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-400" aria-hidden>—</span>
                    Fichier prospect refait à la main à chaque nouveau contact.
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.35rem] border-2 border-[#EFA188] bg-[#EFA188]/25 p-6 shadow-[0_16px_48px_rgba(239,161,136,0.18)] md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E08A6F]">
                  Avec CraftLink
                </p>
                <p className="lk-display mt-3 border-l-4 border-[#212129] pl-4 text-xl md:text-2xl">
                  Clarté côté client, dossier prêt côté pro
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#EFA188]" aria-hidden>✓</span>
                    Même parcours partout : bio, QR, fiche Google — une seule
                    habitude à expliquer.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#EFA188]" aria-hidden>✓</span>
                    Vocaux transcrits, champs structurés, pièces jointes : vous
                    ouvrez un dossier, pas un puzzle.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#EFA188]" aria-hidden>✓</span>
                    WhatsApp inchangé pour vous : la conversation démarre avec le
                    résumé déjà posé.
                  </li>
                </ul>
              </div>
            </div>

            <div className="landing-pourquoi-pillars mt-14 grid gap-4 md:grid-cols-3">
              <PourquoiPillarCard
                pillar={dict.pourquoi.pillars[0]}
                tint="peach"
                icon={<IconPalette className="h-5 w-5" />}
              />
              <PourquoiPillarCard
                pillar={dict.pourquoi.pillars[1]}
                tint="mint"
                icon={<IconShareNetwork className="h-5 w-5" />}
              />
              <PourquoiPillarCard
                pillar={dict.pourquoi.pillars[2]}
                tint="lavender"
                icon={<IconFolder className="h-5 w-5" />}
              />
            </div>
          </div>
        </section>

        {/* Fonctionnalités — bento teinté, enveloppe premium */}
        <section
          id="features"
          className="landing-features lk-section-alt scroll-mt-28"
          aria-labelledby="features-heading"
        >
          <div className="landing-features-inner mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <LandingSectionHeader
              index="02"
              eyebrow="Fonctionnalités"
              id="features-heading"
              title={
                <>
                  La mécanique derrière votre{" "}
                  <span className="lk-marker">page artisan</span>.
                </>
              }
              lead="Chaque bloc couvre une étape du parcours — capture, tri, redirection — sans ajouter de complexité sur le chantier. Le résultat attendu : des demandes prêtes à chiffrer, pas des conversations vides."
            />

            <FeaturesFlowSchema flow={dict.featuresFlow} />

            <div className="landing-features-bento lk-frame mt-12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-4">
                <BentoFeatureCard
                  className="md:col-span-3"
                  eyebrow="Capture vocale"
                  title="Le client parle, vous lisez l’essentiel"
                  description="Les vocaux sont transcrits et mis en forme : moins d’allers-retours pour comprendre le problème sur place."
                  icon={<IconMic className="h-5 w-5" />}
                  tint="peach"
                />
                <BentoFeatureCard
                  className="md:col-span-3"
                  eyebrow="Scoring"
                  title="Repérez les dossiers sérieux en un coup d’œil"
                  description="Un score simple met en avant budget, urgence et complétude : vous rappelez les chantiers qui valent le coup en premier."
                  icon={<IconChart className="h-5 w-5" />}
                  tint="mint"
                />
                <BentoFeatureCard
                  className="md:col-span-2"
                  eyebrow="WhatsApp Smart"
                  title="Redirection avec le contexte déjà là"
                  description="WhatsApp reste votre outil ; le client arrive avec son besoin résumé — vous démarrez la discussion au bon niveau."
                  icon={<IconMessage className="h-5 w-5" />}
                  tint="peach"
                />
                <BentoFeatureCard
                  className="md:col-span-2"
                  eyebrow="Lien unique"
                  title="Un seul lien pour tous vos canaux"
                  description="Bio Instagram/Facebook, QR code sur camionette, SMS après un devis papier : une entrée pro partout."
                  icon={<IconLink className="h-5 w-5" />}
                  tint="lavender"
                />
                <BentoFeatureCard
                  className="md:col-span-2"
                  eyebrow="Export"
                  title="Contacts exploitables"
                  description="Exportez vos leads pour votre suivi habituel ou des options payantes si vous montez en charge."
                  icon={<IconShield className="h-5 w-5" />}
                  tint="mint"
                />
                <div className="rounded-[1.35rem] border-2 border-[#C4B5FD]/45 bg-[#D6BCFA]/22 p-6 md:col-span-6 md:p-8">
                  <div className="grid gap-8 md:grid-cols-2 md:items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#212129]/60">
                        Formulaire intelligent
                      </p>
                      <p className="lk-display mt-4 text-xl md:text-2xl">
                        Des champs courts, mais les bons
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
                        Budget estimé, délais, type d’intervention, commune : vous
                        évitez les messages flous et vous préparez un devis sans
                        repartir de zéro à chaque fois.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {[
                        "Nature du besoin",
                        "Zone / commune",
                        "Urgence ou planning",
                        "Photos ou vocaux",
                        "Contact direct",
                      ].map((f) => (
                        <div
                          key={f}
                          className="rounded-xl border-2 border-white/80 bg-white/90 px-4 py-3 text-sm font-semibold text-[#212129]"
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cas d’usage par métier */}
        <section
          id="metiers"
          className="landing-metiers lk-section scroll-mt-28"
          aria-labelledby="metiers-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <LandingSectionHeader
              index="03"
              eyebrow="Cas d’usage par métier"
              id="metiers-heading"
              title="Une réponse taillée pour les corps de métier du bâtiment"
              lead="Que vous cherchiez une vitrine en ligne pour électricien, un site simple pour plombier ou une entrée unique pour votre menuiserie, le mécanisme reste le même : capturer le besoin net, scorer, puis passer sur WhatsApp."
            />

          <div className="landing-metiers-grid mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metiersCasUsage.map((m, i) => {
              const styles = [
                { border: "border-l-[#EFA188]", bg: "bg-[#EFA188]/10" },
                { border: "border-l-[#5EEAD4]", bg: "bg-[#B2F5EA]/12" },
                { border: "border-l-[#C4B5FD]", bg: "bg-[#D6BCFA]/12" },
              ] as const;
              const style = styles[i % styles.length];
              return (
              <div
                key={m.metier}
                className={`rounded-[1.15rem] border-2 border-[#212129]/8 border-l-[5px] p-6 ${style.border} ${style.bg}`}
              >
                <h3 className="lk-display text-lg">{m.metier}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6478]">
                  {m.angle}
                </p>
              </div>
            );})}
          </div>
          </div>
        </section>

        {/* Section SEO locale retirée (trop long / redondant pour la landing). */}

        <PricingComparisonSection model={pricingModel} basePath={basePath} locale={lang} />

        <LandingFaqDisclosure blocks={faqBlocks} copy={dict.faqUi} />

        {/* CTA inscription */}
        <section id="cta" className="landing-cta relative scroll-mt-28 overflow-visible bg-[#FDFBF7] py-20 md:py-24">
          <LandingHeroDiagonalBrush variant="cta" />
          <div className="landing-cta-inner relative z-10 mx-auto max-w-6xl px-4 md:px-6">
            <div className="rounded-[1.75rem] border-2 border-[#212129] bg-white/95 p-8 shadow-[0_24px_64px_rgba(33,33,41,0.1)] backdrop-blur-sm md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="lk-section-index !mb-2 !text-[3rem] md:!text-[4rem]" aria-hidden>
                    →
                  </p>
                  <h2 className="lk-display text-2xl md:text-4xl">
                    Prêt à transformer vos messages en{" "}
                    <span className="lk-marker">devis utiles</span> ?
                  </h2>
                  <p className="lk-lead mt-4 text-base md:text-lg">
                    Créez votre page pro en quelques minutes : un lien unique,
                    une capture claire, WhatsApp comme vous l’aimez.
                  </p>
                </div>
                <LandingCta
                  href={onboardingPath(lang)}
                  variant="peach"
                  className="min-w-[240px] shrink-0"
                >
                  Créer ma page maintenant
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
