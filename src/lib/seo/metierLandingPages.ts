import type { Locale } from "@/i18n/config";
import type {
  MetierLandingLocaleContent,
  MetierLandingPageEntry,
} from "@/lib/seo/metierLandingTypes";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

type MetierLandingSeed = {
  slugFr: string;
  slugEn: string;
  metierKey: MetierKey;
  tradeFr: string;
  tradeEn: string;
  contextFr: string;
  contextEn: string;
  h1Fr: string;
  h1En: string;
  heroLeadFr: string;
  heroLeadEn: string;
};

function sharedStepsFr(trade: string, context: string): MetierLandingLocaleContent["steps"] {
  return [
    {
      index: "01",
      title: "Votre page reçoit les demandes",
      lead: `Vos clients ${context} décrivent leur besoin via votre lien unique — message structuré, zone et urgence visibles d'emblée.`,
    },
    {
      index: "02",
      title: "Tout arrive dans un seul dashboard",
      lead: `Fini les fils SMS, WhatsApp et Messenger éparpillés. Chaque demande ${trade} est classée et prête à être traitée.`,
    },
    {
      index: "03",
      title: "Vous reprenez vos soirées",
      lead: "En fin de journée, vous voyez qui rappeler en priorité — sans rechercher dans cinq applications différentes.",
    },
  ];
}

function sharedStepsEn(trade: string, context: string): MetierLandingLocaleContent["steps"] {
  return [
    {
      index: "01",
      title: "Your page captures requests",
      lead: `Clients ${context} describe their need through your unique link — structured message, area and urgency visible at a glance.`,
    },
    {
      index: "02",
      title: "Everything lands in one dashboard",
      lead: `No more scattered SMS, WhatsApp and Messenger threads. Every ${trade} request is sorted and ready to handle.`,
    },
    {
      index: "03",
      title: "Reclaim your evenings",
      lead: "At the end of the day, you see who to call back first — without digging through five different apps.",
    },
  ];
}

function sharedFaqFr(trade: string): MetierLandingLocaleContent["faq"] {
  return [
    {
      question: `Comment CraftLink centralise les messages de mes clients ${trade} ?`,
      answer:
        "Vous partagez un lien unique vers votre page CraftLink. Chaque demande — message ou vocal — arrive dans votre dashboard avec le nom, la zone, l'urgence et le résumé du besoin. Plus besoin de jongler entre SMS, WhatsApp et Messenger.",
    },
    {
      question: "Est-ce que mes clients doivent installer une application ?",
      answer:
        "Non. Ils cliquent sur votre lien, décrivent leur besoin et vous joignent via WhatsApp, SMS ou appel — avec le dossier déjà structuré de votre côté.",
    },
    {
      question: "Combien de temps faut-il pour être opérationnel ?",
      answer:
        "Quelques minutes : vous choisissez votre métier, personnalisez votre page et partagez le lien. Vos prochaines demandes arrivent déjà organisées dans CraftLink.",
    },
  ];
}

function sharedFaqEn(trade: string): MetierLandingLocaleContent["faq"] {
  return [
    {
      question: `How does CraftLink centralize messages from my ${trade} clients?`,
      answer:
        "You share a unique link to your CraftLink page. Every request — text or voice — lands in your dashboard with name, area, urgency and a clear summary. No more juggling SMS, WhatsApp and Messenger.",
    },
    {
      question: "Do my clients need to install an app?",
      answer:
        "No. They click your link, describe their need and reach you via WhatsApp, SMS or call — with the dossier already structured on your side.",
    },
    {
      question: "How long does setup take?",
      answer:
        "A few minutes: pick your trade, customize your page and share the link. Your next requests already arrive organized in CraftLink.",
    },
  ];
}

function buildLocaleContent(
  seed: MetierLandingSeed,
  locale: Locale,
): MetierLandingLocaleContent {
  const isFr = locale === "fr";
  const trade = isFr ? seed.tradeFr : seed.tradeEn;
  const context = isFr ? seed.contextFr : seed.contextEn;

  return {
    tradeLabel: trade,
    seoTitle: isFr
      ? `${trade} : Centralisez vos demandes clients | CraftLink`
      : `${trade}: Centralize client requests | CraftLink`,
    seoDescription: isFr
      ? `Gagnez du temps chaque soir. CraftLink regroupe tous les messages de vos clients (${trade}) dans un dashboard unique et épuré. Essayez gratuitement.`
      : `Save time every evening. CraftLink gathers all your ${trade} client messages in one clean dashboard. Try it free.`,
    h1: isFr ? seed.h1Fr : seed.h1En,
    heroPill: isFr ? `Organisation · ${trade}` : `Organization · ${trade}`,
    heroLead: isFr ? seed.heroLeadFr : seed.heroLeadEn,
    heroHighlight: isFr
      ? "Un seul endroit pour lire, classer et recontacter — sans chaos le soir."
      : "One place to read, sort and follow up — no chaos in the evening.",
    painH2: isFr
      ? "Le chaos des messages éparpillés, c'est terminé"
      : "Scattered messages chaos is over",
    painLead: isFr
      ? `Entre deux ${context}, vous enchaînez les notifications sur trois apps différentes. Résultat : oublis, retards de rappel et charge mentale le soir.`
      : `Between ${context}, you stack notifications across three apps. Result: missed follow-ups and mental load every evening.`,
    painBullets: isFr
      ? [
          "Demandes perdues dans les fils WhatsApp et Messenger",
          "Infos clients incomplètes quand vous rappelez sur le parking",
          "Soirées à rattraper ce que vous auriez dû traiter à midi",
        ]
      : [
          "Requests lost in WhatsApp and Messenger threads",
          "Incomplete client info when you call back from the van",
          "Evenings spent catching up on what you should have handled at noon",
        ],
    solutionH2: isFr
      ? "Un dashboard épuré pour recontacter vos clients rapidement"
      : "A clean dashboard to follow up with clients fast",
    solutionLead: isFr
      ? `CraftLink transforme chaque message entrant en dossier ${trade} lisible : qui, quoi, où, quand — avant même d'ouvrir WhatsApp.`
      : `CraftLink turns every inbound message into a readable ${trade} dossier: who, what, where, when — before you even open WhatsApp.`,
    solutionBullets: isFr
      ? [
          "Boîte de réception unique pour les nouvelles demandes",
          "Statuts clairs pour avancer sans vous disperser",
          "Lien public prêt à coller sur Instagram ou votre signature mail",
        ]
      : [
          "Single inbox for new requests",
          "Clear statuses so you move forward without scattering",
          "Public link ready to paste on Instagram or your email signature",
        ],
    stepsEyebrow: isFr ? "Comment ça marche" : "How it works",
    stepsTitle: isFr
      ? `Moins de dispersion, plus de clarté pour les ${trade.toLowerCase()}s`
      : `Less scatter, more clarity for ${trade.toLowerCase()}s`,
    stepsLead: isFr
      ? "Trois étapes pour reprendre le contrôle de vos messages clients."
      : "Three steps to regain control of your client messages.",
    steps: isFr ? sharedStepsFr(trade, context) : sharedStepsEn(trade, context),
    faqEyebrow: isFr ? "Questions fréquentes" : "FAQ",
    faqTitle: isFr ? `CraftLink pour les ${trade.toLowerCase()}s` : `CraftLink for ${trade.toLowerCase()}s`,
    faq: isFr ? sharedFaqFr(trade) : sharedFaqEn(trade),
    ctaTitle: isFr ? "Prêt à centraliser vos demandes" : "Ready to centralize your requests",
    ctaHighlight: isFr ? trade : trade,
    ctaLead: isFr
      ? "Créez votre page en quelques minutes et testez CraftLink gratuitement."
      : "Create your page in minutes and try CraftLink for free.",
    ctaButton: isFr ? "Essayer gratuitement" : "Try for free",
  };
}

function entry(seed: MetierLandingSeed): MetierLandingPageEntry {
  return {
    metierKey: seed.metierKey,
    slugs: { fr: seed.slugFr, en: seed.slugEn },
    content: {
      fr: buildLocaleContent(seed, "fr"),
      en: buildLocaleContent(seed, "en"),
    },
  };
}

const METIER_LANDING_SEEDS: MetierLandingSeed[] = [
  {
    slugFr: "renovation-generale",
    slugEn: "general-renovation",
    metierKey: "RENOVATION_GENERALE",
    tradeFr: "Rénovation générale",
    tradeEn: "General renovation",
    contextFr: "chantiers de rénovation",
    contextEn: "renovation projects",
    h1Fr: "Centralisez toutes vos demandes de rénovation au même endroit",
    h1En: "Centralize all your renovation requests in one place",
    heroLeadFr:
      "Fini les SMS et messages WhatsApp éparpillés. CraftLink regroupe et organise les demandes de vos clients dans un dashboard unique et épuré.",
    heroLeadEn:
      "No more scattered SMS and WhatsApp messages. CraftLink gathers and organizes client requests in one clean dashboard.",
  },
  {
    slugFr: "electricien",
    slugEn: "electrician",
    metierKey: "ELECTRICIEN",
    tradeFr: "Électricien",
    tradeEn: "Electrician",
    contextFr: "interventions électriques",
    contextEn: "electrical jobs",
    h1Fr: "Électriciens : reprenez le contrôle de vos messages clients",
    h1En: "Electricians: take back control of your client messages",
    heroLeadFr:
      "Pannes, mises aux normes, tableaux qui disjonctent : vos clients écrivent partout. CraftLink centralise chaque demande dans un dashboard clair.",
    heroLeadEn:
      "Outages, compliance work, tripping breakers: clients message you everywhere. CraftLink centralizes every request in a clear dashboard.",
  },
  {
    slugFr: "plombier-chauffagiste",
    slugEn: "plumber-heating",
    metierKey: "PLOMBIER",
    tradeFr: "Plombier / Chauffagiste",
    tradeEn: "Plumber / Heating engineer",
    contextFr: "dépannages plomberie et chauffage",
    contextEn: "plumbing and heating call-outs",
    h1Fr: "Plombiers : un seul fil pour toutes vos urgences et demandes",
    h1En: "Plumbers: one thread for every urgent call and request",
    heroLeadFr:
      "Fuites, chaudières, radiateurs : les messages arrivent en rafale sur WhatsApp et SMS. CraftLink les structure avant votre prochain rappel.",
    heroLeadEn:
      "Leaks, boilers, radiators: messages flood in on WhatsApp and SMS. CraftLink structures them before your next callback.",
  },
  {
    slugFr: "macon-btp",
    slugEn: "mason-contractor",
    metierKey: "MACON",
    tradeFr: "Maçon BTP",
    tradeEn: "Mason / Building trades",
    contextFr: "chantiers maçonnerie et gros œuvre",
    contextEn: "masonry and structural jobs",
    h1Fr: "Maçons : organisez vos demandes de chantier sans vous éparpiller",
    h1En: "Masons: organize site requests without losing focus",
    heroLeadFr:
      "Ouvertures, fondations, reprises structurelles : vos prospects envoient photos et messages sur plusieurs canaux. CraftLink les regroupe.",
    heroLeadEn:
      "Openings, foundations, structural work: prospects send photos and messages across channels. CraftLink brings them together.",
  },
  {
    slugFr: "plaquiste",
    slugEn: "drywall-contractor",
    metierKey: "PLAQUISTE",
    tradeFr: "Plaquiste",
    tradeEn: "Drywall installer",
    contextFr: "projets placo et isolation",
    contextEn: "drywall and insulation projects",
    h1Fr: "Plaquistes : fini la chasse aux messages sur les chantiers",
    h1En: "Drywall pros: stop hunting for messages across job sites",
    heroLeadFr:
      "Cloisons, doublages, isolation : vos clients décrivent leurs besoins en messages vocaux et textes. CraftLink les centralise pour vous.",
    heroLeadEn:
      "Partitions, lining, insulation: clients describe needs in voice and text. CraftLink centralizes them for you.",
  },
  {
    slugFr: "peintre",
    slugEn: "painter",
    metierKey: "PEINTRE",
    tradeFr: "Peintre",
    tradeEn: "Painter",
    contextFr: "projets peinture et finitions",
    contextEn: "painting and finishing projects",
    h1Fr: "Peintres : toutes vos demandes clients, au même endroit",
    h1En: "Painters: all client requests in one place",
    heroLeadFr:
      "Ravalement, intérieur, finitions : les messages s'accumulent le soir. CraftLink vous donne une vue claire avant de planifier la semaine.",
    heroLeadEn:
      "Exterior, interior, finishes: messages pile up in the evening. CraftLink gives you a clear view before planning the week.",
  },
  {
    slugFr: "menuisier",
    slugEn: "carpenter",
    metierKey: "MENUISIER",
    tradeFr: "Menuisier",
    tradeEn: "Carpenter",
    contextFr: "projets menuiserie sur mesure",
    contextEn: "custom carpentry projects",
    h1Fr: "Menuisiers : centralisez vos demandes avant de couper la première planche",
    h1En: "Carpenters: centralize requests before cutting the first board",
    heroLeadFr:
      "Agencements, fenêtres, escaliers : chaque prospect arrive par un canal différent. CraftLink unifie le flux pour gagner du temps.",
    heroLeadEn:
      "Fittings, windows, stairs: every prospect comes through a different channel. CraftLink unifies the flow to save time.",
  },
  {
    slugFr: "serrurier",
    slugEn: "locksmith",
    metierKey: "SERRURIER",
    tradeFr: "Serrurier",
    tradeEn: "Locksmith",
    contextFr: "dépannages serrurerie",
    contextEn: "locksmith call-outs",
    h1Fr: "Serruriers : chaque urgence client, classée et prête à traiter",
    h1En: "Locksmiths: every client emergency, sorted and ready",
    heroLeadFr:
      "Portes claquées, blindages, changements de cylindre : les appels et messages s'enchaînent. CraftLink priorise ce qui compte.",
    heroLeadEn:
      "Lockouts, security doors, cylinder changes: calls and messages stack up. CraftLink prioritizes what matters.",
  },
  {
    slugFr: "paysagiste",
    slugEn: "landscaper",
    metierKey: "PAYSAGISTE",
    tradeFr: "Paysagiste",
    tradeEn: "Landscaper",
    contextFr: "projets d'aménagement extérieur",
    contextEn: "outdoor landscaping projects",
    h1Fr: "Paysagistes : vos demandes terrain, regroupées dans un dashboard",
    h1En: "Landscapers: field requests gathered in one dashboard",
    heroLeadFr:
      "Terrasses, engazonnement, entretien : vos clients envoient photos et messages éparpillés. CraftLink structure chaque demande.",
    heroLeadEn:
      "Decks, turf, maintenance: clients send scattered photos and messages. CraftLink structures every request.",
  },
  {
    slugFr: "couvreur",
    slugEn: "roofer",
    metierKey: "COUVREUR",
    tradeFr: "Couvreur",
    tradeEn: "Roofer",
    contextFr: "interventions toiture",
    contextEn: "roofing jobs",
    h1Fr: "Couvreurs : reprenez la main sur vos messages après la tempête",
    h1En: "Roofers: regain control of messages after the storm",
    heroLeadFr:
      "Tuiles, zinguerie, infiltrations : les demandes affluent par SMS et WhatsApp. CraftLink les classe pour rappeler dans le bon ordre.",
    heroLeadEn:
      "Tiles, flashing, leaks: requests flood in via SMS and WhatsApp. CraftLink sorts them so you call back in the right order.",
  },
  {
    slugFr: "carreleur",
    slugEn: "tiler",
    metierKey: "CARRELEUR",
    tradeFr: "Carreleur",
    tradeEn: "Tiler",
    contextFr: "projets carrelage et faïence",
    contextEn: "tiling projects",
    h1Fr: "Carreleurs : un dashboard unique pour vos chantiers en cours",
    h1En: "Tilers: one dashboard for your active jobs",
    heroLeadFr:
      "Salles de bain, terrasses, grand format : vos clients décrivent leurs envies en messages courts. CraftLink les assemble en dossiers clairs.",
    heroLeadEn:
      "Bathrooms, terraces, large format: clients describe wishes in short messages. CraftLink assembles clear dossiers.",
  },
  {
    slugFr: "charpentier",
    slugEn: "framer",
    metierKey: "CHARPENTIER",
    tradeFr: "Charpentier",
    tradeEn: "Framer",
    contextFr: "projets charpente et ossature",
    contextEn: "framing projects",
    h1Fr: "Charpentiers : centralisez vos demandes avant de monter sur le toit",
    h1En: "Framers: centralize requests before climbing the roof",
    heroLeadFr:
      "Modifications de charpente, extensions, combles : les messages clients se dispersent. CraftLink les regroupe pour avancer sereinement.",
    heroLeadEn:
      "Truss changes, extensions, attics: client messages scatter. CraftLink gathers them so you move forward calmly.",
  },
];

export const METIER_LANDING_PAGES: MetierLandingPageEntry[] =
  METIER_LANDING_SEEDS.map(entry);

export function getMetierLandingPage(
  slug: string,
  lang: Locale,
): MetierLandingPageEntry | null {
  return METIER_LANDING_PAGES.find((page) => page.slugs[lang] === slug) ?? null;
}

export function metierLandingPath(entry: MetierLandingPageEntry, lang: Locale): string {
  const slug = entry.slugs[lang];
  return lang === "fr" ? `/metiers/${slug}` : `/en/metiers/${slug}`;
}
