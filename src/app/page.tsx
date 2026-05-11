import type { Metadata } from "next";
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
} from "@/components/landing/Icons";
import { LivePreviewWidget } from "@/components/landing/LivePreviewWidget";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Highlighter } from "@/components/ui/Highlighter";
import { landingService } from "@/services/landingService";

export const metadata: Metadata = {
  title:
    "CraftLink — Page pro artisan en 2 min | Leads Instagram, Facebook & WhatsApp",
  description:
    "Créez une page professionnelle avec un lien unique : tunnel de capture vocale, transcription, scoring des leads et redirection WhatsApp. Pour artisans sans site ou peu équipés — électriciens, plombiers, menuisiers, chauffagistes et corps de métier du bâtiment.",
  keywords: [
    "page vitrine artisan",
    "artisan sans site internet",
    "capture leads artisan",
    "demande de devis artisan",
    "WhatsApp artisan",
    "Instagram artisan devis",
    "page contact artisan",
    "artisan BTP en ligne",
    "plombier électricien site simple",
    "vitrine artisan locale",
  ],
};

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
    metier: "Peintre / façadier",
    angle:
      "Surfaces, finitions, délais souhaités arrivent déjà structurés pour chiffrer plus vite.",
  },
  {
    metier: "Maçon & artisan BTP",
    angle:
      "Gros œuvre ou rénovation : une entrée unique pour les petits chantiers comme pour les réponses aux appels d’offres locaux.",
  },
];

export default async function Home() {
  const preview = await landingService.getPreview();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <MeshBackground intensity="normal" />

          <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-14">
            <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
              <div className="relative md:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  <span className="h-2 w-2 rounded-full bg-[#EFA188]" />
                  Capture de leads pour artisans
                </p>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl">
                  Un lien unique pour{" "}
                  <Highlighter className="font-semibold" color="#EFA188" opacity={0.3}>
                    centraliser toutes vos demandes
                  </Highlighter>{" "}
                  clients.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                  Transformez vos abonnés en demandes de devis qualifiées. Fini
                  le chaos entre vos DM et vos mails : un seul lien sur vos
                  réseaux et votre fiche Google permet à vos prospects de
                  déposer une demande vocale ou écrite. Notre IA traite
                  l'information et vous livre un dossier structuré directement
                  sur la messagerie de votre choix
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <GlowButton href="#cta">Créer ma page pro</GlowButton>
                  <GlowButton href="#cta-demo" variant="secondary">
                    Demander une démo
                  </GlowButton>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Mise en ligne", value: "~2 min" },
                    { label: "Lien unique", value: "Bio · QR · SMS" },
                    { label: "Lead scoring", value: "Priorités claires" },
                    { label: "WhatsApp", value: "Redirection maline" },
                  ].map((k) => (
                    <GlassCard
                      key={k.label}
                      rounded="2xl"
                      elevated={false}
                      className="px-4 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.06)]"
                    >
                      <p className="text-[11px] font-medium text-neutral-600">
                        {k.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {k.value}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </div>

              <div id="preview" className="md:col-span-5 scroll-mt-28">
                <LivePreviewWidget preview={preview} />
              </div>
            </div>
          </div>
        </section>

        {/* Preuve sociale / réassurance */}
        <section
          id="confiance"
          className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 md:px-6 md:py-16"
          aria-labelledby="confiance-heading"
        >
          <div className="max-w-3xl">
            <h2
              id="confiance-heading"
              className="text-2xl font-bold tracking-tight text-black md:text-3xl"
            >
              Pensé pour votre activité, pas pour la figuration.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
              Une interface professionnelle doit être opérationnelle en quelques
              secondes pour valider votre sérieux auprès de vos prospects.
              CraftLink privilégie la pertinence des informations reçues et la
              réactivité de traitement, sans aucune complexité inutile.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Flux de demandes structuré",
                text: "Fini les messages incomplets. Vous recevez un dossier qualifié : nature du projet, localisation, urgence et photos. Vous décidez en un coup d’œil de la suite à donner.",
              },
              {
                title: "Compatibilité Totale",
                text: "Un lien unique optimisé pour toutes vos plateformes : Instagram, Facebook, Snapchat, Threads, Google My Business ou même vos supports physiques (QR Code sur véhicule).",
              },
              {
                title: "Données Exploitables",
                text: "Gardez le contrôle sur votre fichier client. Exportez vos contacts et l’historique des demandes pour alimenter vos outils de gestion ou votre comptabilité.",
              },
              {
                title: "Interface Épurée",
                text: "Une solution conçue pour la mobilité. Accédez à vos leads et gérez vos paramètres via une interface fluide, pensée pour les professionnels en déplacement.",
              },
            ].map((item) => (
              <GlassCard
                key={item.title}
                rounded="2xl"
                className="border border-[#E5E7EB] p-5 shadow-[0_14px_30px_rgba(0,0,0,0.06)]"
              >
                <p className="text-sm font-semibold text-black">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {item.text}
                </p>
              </GlassCard>
            ))}
          </div>

          <GlassCard
            rounded="2xl"
            className="mt-4 border border-[#E5E7EB] bg-white p-5 shadow-[0_14px_30px_rgba(0,0,0,0.06)]"
          >
            <p className="text-sm font-semibold text-black">
              Maintenance & évolutions incluses
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Un site vitrine classique demande de la maintenance et engendre des
              coûts. Avec CraftLink, les améliorations et nouvelles
              fonctionnalités sont intégrées au fil du temps, sans action de
              votre part — et sans frais supplémentaires.
            </p>
          </GlassCard>
        </section>

        {/* Problème / douleur */}
        <section
          id="douleur"
          className="scroll-mt-28 border-y border-neutral-200 bg-neutral-50"
          aria-labelledby="conversion-leads-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              La Conversion de vos Leads
            </p>
            <h2
              id="conversion-leads-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
            >
              Ne laissez plus vos opportunités s’évaporer.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Dans un flux de messages non structurés, la réactivité est
              impossible. Entre les demandes incomplètes et les simples curieux,
              les dossiers prioritaires se perdent. CraftLink agit comme un filtre
              professionnel pour capturer l’essentiel dès le premier contact.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <GlassCard
                rounded="2xl"
                className="border border-neutral-200 bg-white p-6 md:p-7"
              >
                <p className="text-base font-bold text-black">
                  Le constat est simple :
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                  Sur les réseaux sociaux, les sollicitations s’accumulent et
                  l’information se fragmente. Sans un point d’entrée unique et
                  intelligent, vous perdez un temps précieux à relancer pour
                  obtenir des détails basiques.
                </p>
              </GlassCard>
              <GlassCard
                rounded="2xl"
                className="border border-neutral-200 bg-white p-6 md:p-7"
              >
                <p className="text-base font-bold text-black">
                  La solution CraftLink :
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                  Une interface de capture dédiée remplace les sites web
                  complexes et coûteux. Elle permet de séparer immédiatement les
                  demandes sérieuses des sollicitations vagues, vous permettant de
                  vous concentrer sur les chantiers qui comptent vraiment.
                </p>
              </GlassCard>
              <GlassCard
                rounded="2xl"
                className="border border-neutral-200 bg-white p-6 md:p-7 md:col-span-2 lg:col-span-1"
              >
                <p className="text-base font-bold text-black">
                  Tranquille sur le chantier :
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                  Fini les interruptions au milieu d’une pose ou d’un dépannage :
                  les infos utiles sont déjà rassemblées. Vous traitez vos leads
                  quand vous décidez — entre deux passages ou en fin de journée —
                  et vous gagnez du temps sans laisser passer les bonnes
                  opportunités.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-28 px-4 py-14 md:px-6 md:pb-18"
          aria-labelledby="features-heading"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              Proposition de valeur · Fonctionnalités clés
            </p>
            <h2
              id="features-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
            >
              Une page artisan locale qui travaille pendant que vous êtes sur le chantier.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
              Plus simple qu’un site classique, plus efficace qu’une carte seule : un
              lien unique partout (Instagram, Facebook, Google…), un tunnel de
              capture (écrit ou vocal), puis une redirection WhatsApp avec le
              contexte. Le but :{" "}
              <strong className="font-semibold text-black">
                recevoir des demandes de devis qualifiées
              </strong>
              , pas seulement des likes.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6">
            <BentoFeatureCard
              className="md:col-span-3"
              eyebrow="Capture vocale"
              title="Le client parle, vous lisez l’essentiel"
              description="Les vocaux sont transcrits et mis en forme : moins d’allers-retours pour comprendre le problème sur place."
              icon={<IconMic className="h-5 w-5" />}
              accent="amber"
            />

            <BentoFeatureCard
              className="md:col-span-3"
              eyebrow="Scoring"
              title="Repérez les dossiers sérieux en un coup d’œil"
              description="Un score simple met en avant budget, urgence et complétude : vous rappelez les chantiers qui valent le coup en premier."
              icon={<IconChart className="h-5 w-5" />}
              accent="cyan"
            />

            <BentoFeatureCard
              className="md:col-span-2"
              eyebrow="WhatsApp Smart"
              title="Redirection avec le contexte déjà là"
              description="WhatsApp reste votre outil ; le client arrive avec son besoin résumé — vous démarrez la discussion au bon niveau."
              icon={<IconMessage className="h-5 w-5" />}
              accent="rose"
            />

            <BentoFeatureCard
              className="md:col-span-2"
              eyebrow="Lien unique"
              title="Un seul lien pour tous vos canaux"
              description="Bio Instagram/Facebook, QR code sur camionette, SMS après un devis papier : une entrée pro partout."
              icon={<IconLink className="h-5 w-5" />}
              accent="cyan"
            />

            <BentoFeatureCard
              className="md:col-span-2"
              eyebrow="Export"
              title="Contacts exploitables"
              description="Exportez vos leads pour votre suivi habituel ou des options payantes si vous montez en charge."
              icon={<IconShield className="h-5 w-5" />}
              accent="amber"
            />

            <GlassCard rounded="2xl" className="p-6 md:col-span-6 md:p-8">
              <div className="grid gap-8 md:grid-cols-2 md:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
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
                      className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-medium text-neutral-700"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Bénéfices métiers */}
        <section
          id="benefices"
          className="scroll-mt-28 border-t border-neutral-200 bg-neutral-50"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
              Ce que vous gagnez au quotidien
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Une{" "}
              <strong className="font-semibold text-black">
                solution pour artisan indépendant
              </strong>{" "}
              doit répondre à trois impératifs : gagner du temps, éviter les
              pertes de contacts et garder une image pro — même sans équipe
              marketing.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Temps sur le téléphone",
                  desc: "Moins de questions répétitives : le client a déjà trié son besoin avant votre rappel.",
                },
                {
                  title: "Meilleurs chantiers",
                  desc: "Le scoring aide à dire non plus vite aux dossiers trop flous ou hors zone.",
                },
                {
                  title: "Crédibilité instantanée",
                  desc: "Une page lisible sur mobile rassure autant qu’un beau camion propre à votre logo.",
                },
              ].map((b) => (
                <GlassCard
                  key={b.title}
                  rounded="2xl"
                  className="border border-neutral-200 bg-white p-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black text-white">
                      <IconBolt className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-black">{b.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Cas d’usage par métier */}
        <section
          id="metiers"
          className="mx-auto max-w-6xl scroll-mt-28 px-4 py-14 md:px-6 md:py-18"
          aria-labelledby="metiers-heading"
        >
          <div className="max-w-3xl">
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

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* SEO local */}
        <section
          id="seo-local"
          className="scroll-mt-28 border-y border-neutral-200 bg-neutral-50"
          aria-labelledby="seo-local-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <h2
              id="seo-local-heading"
              className="text-3xl font-bold tracking-tight text-black md:text-4xl"
            >
              Visible là où les clients vous cherchent — localement.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Les recherches type «{" "}
              <span className="font-medium text-black">
                plombier urgence près de moi
              </span>{" "}
              », «{" "}
              <span className="font-medium text-black">
                électricien artisan [ville]
              </span>{" "}
              » ou «{" "}
              <span className="font-medium text-black">
                menuisier sur mesure secteur [région]
              </span>{" "}
              » demandent une preuve rapide de sérieux. Votre page CraftLink
              résume vos services, votre zone et la façon simple de vous
              contacter — idéale pour être partagée après un bouche-à-oreille ou
              une story Instagram géolocalisée.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold text-black">
                  Intentions de recherche fréquentes
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li>• Artisan sans site qui veut quand même paraître pro.</li>
                  <li>• Client qui préfère WhatsApp à un formulaire long.</li>
                  <li>
                    • Besoin urgent : le vocal décrit la panne pendant que vous
                    roulez.
                  </li>
                  <li>
                    • Demande de devis après avoir vu vos photos sur les réseaux.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">
                  Variantes locales à jouer sur vos contenus
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  Combinez votre métier + votre ville ou rayon : « chauffagiste
                  artisan Toulouse », « peintre bâtiment Bordeaux métropole »,
                  « serrurier Lyon urgent », « maçon rénovation Nice »… Votre lien
                  CraftLink fait office de{" "}
                  <strong className="font-semibold text-black">
                    page artisan locale
                  </strong>{" "}
                  prête à être collée sur Google Business, forums ou groupes
                  Facebook de quartier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparaison */}
        <section
          id="compare"
          className="mx-auto max-w-6xl scroll-mt-28 px-4 py-14 md:px-6 md:py-18"
          aria-labelledby="compare-heading"
        >
          <h2
            id="compare-heading"
            className="text-3xl font-bold tracking-tight text-black md:text-4xl"
          >
            CraftLink ou un site classique ?
          </h2>
          <p className="mt-4 max-w-3xl text-base text-neutral-700 md:text-lg">
            Les deux peuvent coexister ; pour un artisan sans équipe web,
            CraftLink enlève la friction du démarrage.
          </p>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 font-semibold text-black md:px-6">
                    Critère
                  </th>
                  <th className="px-4 py-3 font-semibold text-black md:px-6">
                    Site vitrine classique
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#C96B4A] md:px-6">
                    CraftLink
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {[
                  {
                    k: "Temps avant d’être en ligne",
                    classic: "Souvent plusieurs jours à plusieurs semaines.",
                    us: "Quelques minutes pour une page utile.",
                  },
                  {
                    k: "Coût caché (hébergement, thème, plugins)",
                    classic: "À suivre et à mettre à jour régulièrement.",
                    us: "Modèle SaaS clair ; options payantes au besoin.",
                  },
                  {
                    k: "Capture depuis Instagram / Facebook",
                    classic: "Souvent limitée à un lien « Contact » générique.",
                    us: "Tunnel dédié + vocal + scoring + WhatsApp.",
                  },
                  {
                    k: "Maintenance au quotidien",
                    classic: "Contenus, sécurité, compatibilité mobile…",
                    us: "Pages pensées mobile-first ; vous vous concentrez sur les chantiers.",
                  },
                ].map((row) => (
                  <tr key={row.k}>
                    <td className="px-4 py-4 font-medium text-black md:px-6">
                      {row.k}
                    </td>
                    <td className="px-4 py-4 text-neutral-700 md:px-6">
                      {row.classic}
                    </td>
                    <td className="px-4 py-4 text-neutral-800 md:px-6">
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tarifs */}
        <section
          id="tarifs"
          className="scroll-mt-28 border-t border-neutral-200 bg-neutral-50"
          aria-labelledby="tarifs-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Tarifs & offre
              </p>
              <h2
                id="tarifs-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl"
              >
                Commencer léger, activer le reste quand ça tourne.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
                Pas de configuration complexe : vous démarrez avec l’essentiel,
                puis vous ajoutez scoring poussé, exports ou options métier
                lorsque le volume de demandes le justifie.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[
                {
                  name: "Essentiel",
                  pitch: "Pour tester sans friction.",
                  bullets: [
                    "Page pro + lien unique",
                    "Formulaire structuré",
                    "Compatible Instagram / Facebook",
                  ],
                  cta: "Créer ma page",
                  href: "#cta",
                  featured: false,
                },
                {
                  name: "Pro artisan",
                  pitch: "Pour ceux qui veulent trier et convertir.",
                  bullets: [
                    "Vocaux & transcription IA",
                    "Lead scoring",
                    "WhatsApp Smart",
                    "Exports contacts",
                  ],
                  cta: "Voir avec nous",
                  href: "#cta-demo",
                  featured: true,
                },
                {
                  name: "Options",
                  pitch: "Pour les équipes ou besoins avancés.",
                  bullets: [
                    "Services payants à la carte",
                    "Accompagnement mise en route",
                    "Évolutions sur mesure (sur étude)",
                  ],
                  cta: "Parler à l’équipe",
                  href: "#cta-demo",
                  featured: false,
                },
              ].map((tier) => (
                <GlassCard
                  key={tier.name}
                  rounded="2xl"
                  className={`flex flex-col border p-6 md:p-7 ${
                    tier.featured
                      ? "border-black shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    {tier.name}
                  </p>
                  <p className="mt-3 text-lg font-bold text-black">
                    {tier.pitch}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-neutral-700">
                    {tier.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <GlowButton
                      href={tier.href}
                      variant={tier.featured ? "primary" : "secondary"}
                      className="w-full justify-center sm:w-auto"
                    >
                      {tier.cta}
                    </GlowButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-6xl scroll-mt-28 px-4 py-14 md:px-6 md:py-18"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="text-3xl font-bold tracking-tight text-black md:text-4xl"
          >
            Questions fréquentes
          </h2>
          <p className="mt-4 max-w-3xl text-base text-neutral-700 md:text-lg">
            Les réponses aux objections les plus courantes — budget, temps,
            techno, WhatsApp et réseaux sociaux.
          </p>

          <div className="mt-10 space-y-12">
            {faqBlocks.map((block) => (
              <div key={block.title}>
                <h3 className="text-lg font-bold text-black">{block.title}</h3>
                <div className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                  {block.items.map((item) => (
                    <details
                      key={item.q}
                      className="group px-4 py-4 md:px-6 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-medium text-black">
                        <span>{item.q}</span>
                        <span className="mt-0.5 shrink-0 text-neutral-400 transition group-open:rotate-180">
                          ⌄
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA inscription */}
        <section id="cta" className="relative scroll-mt-28 overflow-hidden py-14">
          <MeshBackground intensity="subtle" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-6">
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
          className="scroll-mt-28 border-t border-neutral-200 bg-neutral-900 py-14 text-white"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
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
                className="min-w-[220px] shrink-0 border border-white/20 bg-white text-black hover:bg-neutral-100"
              >
                Réserver une démo
              </GlowButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-6">
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
