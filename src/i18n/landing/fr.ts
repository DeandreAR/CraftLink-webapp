import type { LandingExtendedDictionary } from "@/i18n/landing/types";

export const landingFr: LandingExtendedDictionary = {
  faqBlocks: [
    {
      title: "Prise en main",
      items: [
        {
          q: "Je ne suis pas à l’aise avec la technologie.",
          a: "Pas de jargon. Vous remplissez l’essentiel, vous récupérez un lien pour votre bio ou votre carte. Si vous savez envoyer un WhatsApp, vous savez utiliser CraftLink.",
        },
        {
          q: "Je n’ai pas le temps de créer un site.",
          a: "Votre page est prête en quelques minutes. Services, zone, contact : le reste (vocaux, tri, WhatsApp) tourne pendant que vous êtes sur le chantier.",
        },
        {
          q: "Combien de temps pour être en ligne ?",
          a: "Quelques minutes suffisent pour publier votre lien. Vous peaufinez plus tard si besoin.",
        },
      ],
    },
    {
      title: "Prix et rentabilité",
      items: [
        {
          q: "C’est trop cher pour moi.",
          a: "Une entrée gratuite existe pour tester. Un chantier gagné rembourse vite l’abonnement. Une demande floue perdue, elle, ne se rattrape pas.",
        },
      ],
    },
    {
      title: "Fonctionnement concret",
      items: [
        {
          q: "Comment mes clients me trouvent-ils ?",
          a: "Comme aujourd’hui : réseaux, bouche-à-oreille, flyers. La différence : ils passent par votre lien et vous recevez une demande écrite ou un vocal transcrit.",
        },
        {
          q: "Est-ce adapté à mon métier ?",
          a: "Oui si vous faites des devis dans le bâtiment : électricien, plombier, menuisier, peintre, maçon, couvreur, rénovation générale… CraftLink trie les demandes avant que vous les traitiez.",
        },
        {
          q: "Est-ce que ça remplace un site web ?",
          a: "Pour beaucoup d’artisans, c’est la vitrine principale : une page claire + capture de demandes. Un gros site peut rester un complément.",
        },
      ],
    },
    {
      title: "Instagram, Facebook et WhatsApp",
      items: [
        {
          q: "Est-ce que ça marche si je n’ai que Facebook ou Instagram ?",
          a: "Oui. Même lien en bio, sur Facebook, en story ou sur un QR code chantier.",
        },
        {
          q: "Est-ce que je peux garder WhatsApp ?",
          a: "Oui. WhatsApp reste votre canal. CraftLink prépare le dossier avant : besoin, zone, délai, photos si besoin.",
        },
      ],
    },
    {
      title: "Données et support",
      items: [
        {
          q: "Est-ce que mes données sont sécurisées ?",
          a: "Connexion sécurisée et bonnes pratiques pro. Détails dans notre politique de confidentialité (RGPD).",
        },
      ],
    },
  ],
  cta: {
    title: "Prêt à recevoir des demandes",
    titleHighlight: "claires et complètes",
    lead: "Créez votre page en quelques minutes : un lien, des dossiers structurés, WhatsApp comme d’habitude.",
    button: "Créer ma page maintenant",
  },
  pourquoi: {
    header: {
      index: "01",
      eyebrow: "Avant / Après",
      title: "Moins de messages flous. Plus de vrais chantiers.",
      titleHighlight: "vrais chantiers",
      lead: "Entre deux chantiers, les messages s’accumulent partout. CraftLink centralise et trie avant que vous repreniez le soir.",
    },
    badge: "Sans maintenance · Zéro webmaster",
    badgeHint: "Vous travaillez. L’outil trie les demandes.",
    without: {
      label: "Avant CraftLink",
      title:
        "Des dizaines de messages éparpillés (SMS, Facebook, WhatsApp) ➡️ La moitié manque d'informations précises.",
      bullets: [],
    },
    with: {
      label: "Après CraftLink",
      title:
        "Des demandes claires et complètes centralisées au même endroit ➡️ Vous savez exactement par quoi commencer.",
      bullets: [],
    },
  },
  features: {
    header: {
      index: "02",
      eyebrow: "Comment ça marche",
      title: "Trois étapes. Zéro perte de temps.",
      titleHighlight: "Zéro perte de temps",
      lead: "1. Le client explique son besoin en 1 minute (par écrit ou par message vocal). 2. CraftLink organise et trie la demande automatiquement. 3. Vous recontactez uniquement les dossiers sérieux et complets.",
    },
    cards: [
      {
        eyebrow: "Vocal",
        title: "Le client s’exprime, vous lisez l’essentiel",
        description:
          "Le message vocal est transcrit. Vous comprenez le chantier sans relancer le client trois fois.",
      },
      {
        eyebrow: "Tri auto",
        title: "Les demandes sérieuses remontent en premier",
        description:
          "Tri automatique des demandes : délai, zone, complétude. Vous chiffrez les bons dossiers d’abord.",
      },
      {
        eyebrow: "WhatsApp",
        title: "Vous recontactez avec le dossier sous les yeux",
        description:
          "WhatsApp reste votre outil. Le client arrive avec son besoin déjà résumé.",
      },
      {
        eyebrow: "Un lien",
        title: "Un seul lien partout",
        description:
          "Bio Instagram, Facebook, QR sur la camionnette : une entrée pro, partout.",
      },
      {
        eyebrow: "Export",
        title: "Vos contacts prêts à suivre",
        description:
          "Exportez vos demandes pour votre suivi habituel ou vos outils de devis.",
      },
    ],
    formBlock: {
      eyebrow: "Formulaire client",
      title: "Les bonnes infos, dès le premier message",
      description:
        "Nature du besoin, zone, délai, photos ou vocal : fini les « bonjour, c’est pour un devis » sans détail.",
      fields: [
        "Nature du besoin",
        "Zone / commune",
        "Urgence ou planning",
        "Photos ou vocaux",
        "Contact direct",
      ],
    },
  },
  metiers: {
    header: {
      index: "03",
      eyebrow: "Métiers du bâtiment",
      title: "Pensé pour votre corps de métier",
      lead: "Un lien, un formulaire, un tri : moins de messages éparpillés, plus de temps sur les chantiers qui paient.",
    },
    cards: [
      {
        metier: "Électricien",
        angle:
          "Dépannage ou mise aux normes : le client pose le problème, vous recevez un dossier prêt à chiffrer.",
      },
      {
        metier: "Plombier / chauffagiste",
        angle:
          "Fuite ou chauffe-eau en panne : le client décrit en vocal ce qu’il voit chez lui.",
      },
      {
        metier: "Menuisier",
        angle:
          "Fenêtres, portes, agencement : dimensions et besoin récupérés sans 15 messages éparpillés.",
      },
      {
        metier: "Serrurier",
        angle:
          "Porte bloquée : zone et urgence identifiées tout de suite pour organiser le déplacement.",
      },
      {
        metier: "Plaquiste",
        angle:
          "Cloisons ou isolation : pièces et contraintes cadrées avant votre visite.",
      },
      {
        metier: "Peintre",
        angle:
          "Surfaces et finitions : le client précise les m² et le délai avant le chiffrage.",
      },
      {
        metier: "Paysagiste",
        angle:
          "Entretien ou création de jardin : surface et photos guident votre première visite.",
      },
      {
        metier: "Couvreur",
        angle:
          "Fuite ou réfection toiture : étage, urgence et accès décrits avant votre passage.",
      },
      {
        metier: "Carreleur",
        angle:
          "Salle de bain ou grand format : dimensions et photos limitent les mauvaises surprises.",
      },
      {
        metier: "Charpentier",
        angle:
          "Ossature ou combles : type d’ouvrage et accès chantier cadrés à l’avance.",
      },
      {
        metier: "Maçon & artisan BTP",
        angle:
          "Gros œuvre ou extension : une entrée unique pour les petits chantiers et les réponses aux offres.",
      },
      {
        metier: "Entreprise de rénovation générale / TCE",
        angle:
          "Suivi de chantiers, extensions ou rénovations complètes : l'IA structure les pièces, les volumes et la nature des travaux pour vous faire gagner des heures sur vos premiers chiffrages.",
      },
    ],
  },
};
