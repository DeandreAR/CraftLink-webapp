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
  control: {
    header: {
      index: "01",
      eyebrow: "Comment ça marche",
      title: "Reprenez le contrôle de vos messages. Zéro perte de temps.",
      titleHighlight: "Zéro perte de temps.",
      lead: "Un parcours unique : le client explique, CraftLink trie, vous chiffrez les bons dossiers.",
    },
    imageAlt:
      "Artisan avec casque jaune consulte son téléphone et reçoit une notification de mission acceptée.",
    compare: {
      eyebrow: "Avant / Après",
      without: {
        label: "Avant CraftLink",
        title:
          "Des dizaines de messages éparpillés (SMS, Facebook, WhatsApp) ➡️ La moitié manque d’informations précises.",
      },
      with: {
        label: "Après CraftLink",
        title:
          "Des demandes claires et complètes centralisées au même endroit ➡️ Vous savez exactement par quoi commencer.",
      },
    },
    steps: [
      {
        index: "Étape 1",
        title: "Le client explique son besoin (écrit ou vocal)",
        lead: "Fini les SMS et messages éparpillés. Tout arrive proprement au même endroit.",
      },
      {
        index: "Étape 2",
        title: "CraftLink trie la demande automatiquement",
        lead: "L’assistant extrait les volumes, les pièces et l’urgence sans que vous n’ayez rien à faire.",
      },
      {
        index: "Étape 3",
        title: "Vous recontactez uniquement les dossiers sérieux",
        lead: "Vous gagnez des heures chaque soir en éliminant les curieux.",
      },
    ],
  },
  metiers: {
    header: {
      index: "02",
      eyebrow: "Métiers du bâtiment",
      title: "Pensé pour votre corps de métier",
      lead: "Un lien, un formulaire, un tri : moins de messages éparpillés, plus de temps sur les chantiers qui paient.",
    },
    imageAlt:
      "Deux artisans du bâtiment souriants sur un chantier en rénovation, avec un escabeau.",
    showAllMetiers: "Afficher tous les métiers",
    showLessMetiers: "Réduire la liste",
    urgencyBadge: "Urgence",
    cards: [
      {
        metierKey: "RENOVATION_GENERALE",
        metier: "Entreprise de rénovation générale / TCE",
        angle:
          "Suivi de chantiers, extensions ou rénovations complètes : pièces, volumes et nature des travaux structurés pour vos premiers chiffrages.",
      },
      {
        metierKey: "ELECTRICIEN",
        metier: "Électricien",
        angle:
          "Dépannage ou mise aux normes : le client pose le problème, vous recevez un dossier prêt à chiffrer.",
      },
      {
        metierKey: "PLOMBIER",
        metier: "Plombier / chauffagiste",
        angle:
          "Fuite ou chauffe-eau en panne : le client décrit en vocal ce qu’il voit chez lui.",
      },
      {
        metierKey: "MACON",
        metier: "Maçon & artisan BTP",
        angle:
          "Gros œuvre ou extension : une entrée unique pour les petits chantiers et les réponses aux offres.",
      },
      {
        metierKey: "PLAQUISTE",
        metier: "Plaquiste",
        angle:
          "Cloisons ou isolation : pièces et contraintes cadrées avant votre visite.",
      },
      {
        metierKey: "PEINTRE",
        metier: "Peintre",
        angle:
          "Surfaces et finitions : le client précise les m² et le délai avant le chiffrage.",
      },
      {
        metierKey: "MENUISIER",
        metier: "Menuisier",
        angle:
          "Fenêtres, portes, agencement : dimensions et besoin récupérés sans 15 messages éparpillés.",
      },
      {
        metierKey: "SERRURIER",
        metier: "Serrurier",
        angle:
          "Porte bloquée : zone et urgence identifiées tout de suite pour organiser le déplacement.",
      },
      {
        metierKey: "PAYSAGISTE",
        metier: "Paysagiste",
        angle:
          "Entretien ou création de jardin : surface et photos guident votre première visite.",
      },
      {
        metierKey: "COUVREUR",
        metier: "Couvreur",
        angle:
          "Fuite ou réfection toiture : étage, urgence et accès décrits avant votre passage.",
      },
      {
        metierKey: "CARRELEUR",
        metier: "Carreleur",
        angle:
          "Salle de bain ou grand format : dimensions et photos limitent les mauvaises surprises.",
      },
      {
        metierKey: "CHARPENTIER",
        metier: "Charpentier",
        angle:
          "Ossature ou combles : type d’ouvrage et accès chantier cadrés à l’avance.",
      },
    ],
  },
};
