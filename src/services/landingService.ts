import type { ArtisanPreview, LandingPillar } from "@/domain/landing";

export type LandingService = {
  getPillars(): Promise<LandingPillar[]>;
  getPreview(): Promise<ArtisanPreview>;
};

export const landingService: LandingService = {
  async getPillars() {
    return [
      {
        id: "conversion-social",
        title: "Réseaux → demandes utiles",
        description:
          "Un lien unique dans votre bio : vos abonnés Instagram/Facebook décrivent leur besoin (y compris à la voix). Vous recevez une demande lisible, pas un fil de messages perdus.",
        highlight: "Social → devis",
      },
      {
        id: "voice-ai",
        title: "Voix + transcription",
        description:
          "Le client peut parler : la voix est transcrite et structurée pour vous. Moins de Va-et-vient, plus de chantiers bien cadrés.",
        highlight: "Moins de friction",
      },
      {
        id: "lead-scoring",
        title: "Tri automatique des leads",
        description:
          "Scores simples pour repérer les urgences et les budgets sérieux. Vous rappelez les bons dossiers en premier.",
        highlight: "Priorités claires",
      },
      {
        id: "whatsapp-smart",
        title: "WhatsApp malin",
        description:
          "Redirection intelligente vers votre WhatsApp avec le contexte déjà collecté : vous ouvrez la discussion au bon niveau.",
        highlight: "WhatsApp prêt à l’emploi",
      },
      {
        id: "export-options",
        title: "Export & options",
        description:
          "Export des contacts pour votre carnet d’adresses ou votre facturation. Des options payantes si vous voulez aller plus loin.",
        highlight: "Vous gardez vos données",
      },
      {
        id: "express-setup",
        title: "En ligne très vite",
        description:
          "Une page pro sans site compliqué : mise en route express, vocabulaire simple, pensée pour le terrain.",
        highlight: "2 minutes",
      },
    ];
  },

  async getPreview() {
    return {
      displayName: "Marc Bernard",
      craft: "Plombier chauffagiste",
      city: "Toulouse",
      tags: ["Urgence", "Rénovation", "Mise aux normes"],
      about:
        "Interventions rapides et devis clairs. Décrivez votre problème (écrit ou vocal) : je vous rappelle avec une fourchette honnête et les bonnes questions.",
      stats: [
        { label: "Temps de mise en place", value: "2 min" },
        { label: "Lien unique bio / QR", value: "Oui" },
        { label: "Demandes qualifiées", value: "↑" },
      ],
    };
  },
};

