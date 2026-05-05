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
        title: "Conversion Social Media",
        description:
          "Transformez vos abonnés Instagram/Facebook en demandes de devis claires — sans DM perdus.",
        highlight: "Followers → Devis",
      },
      {
        id: "express-setup",
        title: "Express setup",
        description:
          "Une page pro prête en minutes (pas en heures). Zéro technique, zéro friction.",
        highlight: "Prêt en 2 min",
      },
      {
        id: "unique-link",
        title: "Un lien unique",
        description:
          "Un seul lien pour bio, SMS, cartes de visite, QR code. Toujours à jour.",
        highlight: "Un seul URL",
      },
      {
        id: "no-friction",
        title: "No‑friction",
        description:
          "Pas d’usine à gaz, pas de builder lourd. Juste l’essentiel, au bon endroit.",
        highlight: "Simple & premium",
      },
    ];
  },

  async getPreview() {
    return {
      displayName: "Camille Dupont",
      craft: "Céramiste",
      city: "Lyon",
      tags: ["Sur‑mesure", "Mariage", "Vaisselle"],
      about:
        "Je crée des pièces sur commande au rendu doux et lumineux. Vous me décrivez votre idée, je vous propose une maquette et un devis clair.",
      stats: [
        { label: "Temps de mise en place", value: "2 min" },
        { label: "Lien unique", value: "Oui" },
        { label: "Devis entrants", value: "↑" },
      ],
    };
  },
};

