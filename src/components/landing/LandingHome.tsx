import { Navbar } from "@/components/landing/Navbar";
import { MeshBackground } from "@/components/landing/MeshBackground";
import { BentoFeatureCard } from "@/components/landing/BentoFeatureCard";
import {
  IconBolt,
  IconChart,
  IconLink,
  IconMessage,
  IconMic,
  IconShield,
  IconSparkles,
} from "@/components/landing/Icons";
import { LandingFaqDisclosure } from "@/components/landing/LandingFaqDisclosure";
import { HeroAsideShowcase } from "@/components/landing/HeroAsideShowcase";
import { HeroTypingTitle } from "@/components/landing/HeroTypingTitle";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { PricingComparisonSection } from "@/components/landing/PricingComparisonSection";
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
        a: "Les informations de vos clients méritent du sérieux : stockage et accès sont conçus dans une logique professionnelle (connexion sécurisée, bonnes pratiques). Les détails précis sont précisés dans nos documents légaux au moment de l’inscription.",
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
    <div className="landing-home min-h-screen bg-white text-black">
      <Navbar basePath={basePath} labels={dict.nav} />

      <main className="landing-main relative">
        {/* Hero */}
        <section className="landing-hero relative overflow-x-hidden overflow-y-visible">
          <MeshBackground intensity="normal" />

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

                    <div className="landing-hero-ctas mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <GlowButton href={`${basePath}#cta`}>
                        {dict.hero.ctaPrimary}
                      </GlowButton>
                      <GlowButton href={`${basePath}#cta-demo`}>
                        {dict.hero.ctaSecondary}
                      </GlowButton>
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

        {/* Transition douce hero → contenu */}
        <div
          className="landing-hero-divider pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
          aria-hidden
        />

        {/* Pourquoi : synthèse + sans/avec + 3 piliers colorés */}
        <section
          id="pourquoi"
          className="landing-pourquoi scroll-mt-28 bg-white"
          aria-labelledby="pourquoi-heading"
        >
          <div className="landing-pourquoi-inner mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              Pourquoi CraftLink ?
            </p>
            <h2
              id="pourquoi-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
            >
              Une entrée qui clarifie le besoin, pas une vitrine de plus.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Quand les sollicitations arrivent en rafale depuis plusieurs canaux,
              le vrai goulot d’étranglement n’est pas le manque de visibilité :
              c’est l’absence de cadre. CraftLink impose un parcours court et
              lisible — vous gardez la main sur le moment où vous rappelez, avec
              un dossier déjà exploitable.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#D6BCFA] bg-[#D6BCFA]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 shadow-[0_8px_24px_rgba(214,188,250,0.25)]">
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-[#D6BCFA]"
                  aria-hidden
                />
                Zéro maintenance · Évolutif
              </span>
              <span className="text-sm text-neutral-600">
                Mises à jour et nouveautés côté produit, sans charge pour vous.
              </span>
            </div>

            <div className="landing-pourquoi-compare mt-12 grid gap-4 md:grid-cols-2">
              <div className="landing-pourquoi-sans rounded-3xl border border-neutral-200 bg-neutral-100 p-6 text-neutral-600 shadow-inner md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Sans CraftLink
                </p>
                <p className="mt-3 text-lg font-bold text-neutral-800">
                  Le flou des canaux mélangés
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed md:text-base">
                  <li className="flex gap-2">
                    <span className="text-neutral-400" aria-hidden>
                      —
                    </span>
                    Fils DM, mails et SMS qui ne se recoupent pas : le contexte
                    saute entre deux notifications.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-400" aria-hidden>
                      —
                    </span>
                    Même question posée cinq fois pour obtenir commune, budget ou
                    niveau d’urgence.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-400" aria-hidden>
                      —
                    </span>
                    Fichier prospect refait à la main à chaque nouveau contact.
                  </li>
                </ul>
              </div>

              <div className="landing-pourquoi-avec rounded-3xl border border-[#EFA188]/40 bg-gradient-to-br from-[#EFA188]/[0.14] via-white to-white p-6 shadow-[0_20px_50px_rgba(239,161,136,0.12)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EFA188]">
                  Avec CraftLink
                </p>
                <p className="mt-3 border-l-4 border-[#EFA188] pl-4 text-lg font-bold text-black">
                  Clarté côté client, dossier prêt côté pro
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-800 md:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#EFA188]" aria-hidden>
                      ✓
                    </span>
                    Même parcours partout : bio, QR, fiche Google — une seule
                    habitude à expliquer.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#EFA188]" aria-hidden>
                      ✓
                    </span>
                    Vocaux transcrits, champs structurés, pièces jointes : vous
                    ouvrez un dossier, pas un puzzle.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#EFA188]" aria-hidden>
                      ✓
                    </span>
                    WhatsApp inchangé pour vous : la conversation démarre avec le
                    résumé déjà posé.
                  </li>
                </ul>
              </div>
            </div>

            <div className="landing-pourquoi-pillars mt-14 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-[#EFA188]/25 bg-[#EFA188]/[0.12] p-6 md:p-7">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EFA188] text-white shadow-[0_12px_28px_rgba(239,161,136,0.35)]">
                    <IconBolt className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Vitesse & express
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-800 md:text-base">
                      Mise en ligne en quelques minutes, vocaux mis en forme :
                      moins d’allers-retours avant d’être crédible et réactif.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#B2F5EA]/35 bg-[#B2F5EA]/[0.12] p-6 md:p-7">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#B2F5EA] text-neutral-900 shadow-[0_12px_28px_rgba(20,184,166,0.2)]">
                    <IconChart className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Croissance & leads
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-800 md:text-base">
                      Scoring, exports et tunnel dédié : priorisez les dossiers
                      sérieux et nourrissez votre suivi sans tout ressaisir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#D6BCFA]/30 bg-[#D6BCFA]/[0.12] p-6 md:p-7">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#D6BCFA] text-neutral-900 shadow-[0_12px_28px_rgba(139,92,246,0.18)]">
                    <IconSparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Simplicité & tech
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-800 md:text-base">
                      Interface mobile-first, jargon tenu à distance : vous
                      pilotez l’essentiel depuis le terrain, sans formation longue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fonctionnalités — bento teinté, enveloppe premium */}
        <section
          id="features"
          className="landing-features scroll-mt-28 border-t border-neutral-200 bg-gradient-to-b from-neutral-50/80 via-white to-white"
          aria-labelledby="features-heading"
        >
          <div className="landing-features-inner mx-auto max-w-6xl px-4 py-14 md:px-6 md:pb-18">
            <div className="landing-features-header max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Fonctionnalités
              </p>
              <h2
                id="features-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
              >
                La mécanique derrière votre page artisan.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
                Chaque bloc couvre une étape du parcours — capture, tri,
                redirection — sans ajouter de complexité sur le chantier. Le
                résultat attendu : des demandes{" "}
                <strong className="font-semibold text-black">
                  prêtes à chiffrer
                </strong>
                , pas des conversations vides.
              </p>
            </div>

            <div className="landing-features-bento mt-10 rounded-[2rem] border border-neutral-200/80 bg-gradient-to-br from-white via-[#EFA188]/[0.04] to-[#D6BCFA]/[0.06] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.06)] md:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6">
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

                <GlassCard
                  rounded="2xl"
                  className="border border-[#D6BCFA]/30 bg-[#D6BCFA]/[0.08] p-6 md:col-span-6 md:p-8"
                >
                  <div className="grid gap-8 md:grid-cols-2 md:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                        Formulaire intelligent
                      </p>
                      <p className="mt-4 text-xl font-bold tracking-tight text-black md:text-2xl">
                        Des champs courts, mais les bons
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-700 md:text-base">
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
                          className="rounded-2xl border border-[#D6BCFA]/25 bg-white/90 px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm"
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* Cas d’usage par métier */}
        <section
          id="metiers"
          className="landing-metiers mx-auto max-w-6xl scroll-mt-28 px-4 py-14 md:px-6 md:py-18"
          aria-labelledby="metiers-heading"
        >
          <div className="landing-metiers-header max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              Cas d’usage par métier
            </p>
            <h2
              id="metiers-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
            >
              Une réponse taillée pour les corps de métier du bâtiment
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
              Que vous cherchiez une{" "}
              <strong className="font-semibold text-black">
                vitrine en ligne pour électricien
              </strong>
              , un{" "}
              <strong className="font-semibold text-black">
                site simple pour plombier
              </strong>{" "}
              ou une entrée unique pour votre menuiserie, le mécanisme reste le
              même : capturer le besoin net, scorer, puis passer sur WhatsApp.
            </p>
          </div>

          <div className="landing-metiers-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metiersCasUsage.map((m) => (
              <GlassCard
                key={m.metier}
                rounded="2xl"
                className="border border-[#E5E7EB] p-6"
              >
                <h3 className="text-lg font-bold text-black">{m.metier}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {m.angle}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section SEO locale retirée (trop long / redondant pour la landing). */}

        <PricingComparisonSection model={pricingModel} basePath={basePath} />

        <LandingFaqDisclosure blocks={faqBlocks} />

        {/* CTA inscription */}
        <section id="cta" className="landing-cta relative scroll-mt-28 overflow-hidden py-14">
          <MeshBackground intensity="subtle" />
          <div className="landing-cta-inner relative mx-auto max-w-6xl px-4 md:px-6">
            <GlassCard rounded="2xl" className="border border-neutral-200 p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    Prêt à transformer vos messages en devis utiles ?
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
                    Créez votre page pro en quelques minutes : un lien unique,
                    une capture claire, WhatsApp comme vous l’aimez. Pas besoin
                    d’être développeur pour avoir l’air pro en ligne.
                  </p>
                </div>
                <GlowButton href="#" className="min-w-[220px] shrink-0">
                  Créer ma page maintenant
                </GlowButton>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* CTA démo */}
        <section
          id="cta-demo"
          className="landing-cta-demo scroll-mt-28 border-t border-neutral-200 bg-neutral-900 py-14 text-white"
        >
          <div className="landing-cta-demo-inner mx-auto max-w-6xl px-4 md:px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Accompagnement
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                  Besoin d’une démo ou d’un cas métier précis ?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-neutral-300 md:text-lg">
                  On vous montre comment présenter vos services, récupérer des
                  vocaux propres et brancher WhatsApp sans perdre vos habitudes.
                </p>
              </div>
              <GlowButton
                href="#"
                className="min-w-[220px] shrink-0 ring-2 ring-white/25"
              >
                Réserver une démo
              </GlowButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer border-t border-neutral-200/70 bg-white">
        <div className="landing-footer-inner mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-medium text-neutral-700">
            © {new Date().getFullYear()} CraftLink — Page pro artisan, capture de
            leads, WhatsApp.
          </p>
          <p className="max-w-md text-right md:text-right">
            Mots-clés intégrés naturellement : vitrine artisan, leads Instagram,
            scoring, transcription vocale.
          </p>
        </div>
      </footer>
    </div>
  );
}
