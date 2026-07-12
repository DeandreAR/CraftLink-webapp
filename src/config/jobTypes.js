/** @typedef {{ fr: string; en: string }} LocalizedString */

/** @typedef {{ fr: string[]; en: string[] }} LocalizedNeeds */

/** @typedef {{ label: LocalizedString; needs: LocalizedNeeds }} JobTypeConfig */

/** Option générique disponible pour tous les métiers (MVP). */
export const JOB_NEED_OTHER = {
  fr: "Autre",
  en: "Other",
};

/**
 * Métiers artisan et leurs 5 natures de besoin (+ « Autre » ajouté côté UI).
 * Les clés correspondent à `MetierKey` (`src/lib/vitrine/metierConfigs.ts`).
 *
 * @type {Record<string, JobTypeConfig>}
 */
export const JOB_TYPES = {
  ELECTRICIEN: {
    label: { fr: "Électricien", en: "Electrician" },
    needs: {
      fr: [
        "Panne / dépannage",
        "Mise aux normes tableau électrique",
        "Installation neuve (construction/rénovation)",
        "Borne de recharge véhicule électrique",
        "Diagnostic électrique (vente/location)",
      ],
      en: [
        "Breakdown / emergency repair",
        "Electrical panel upgrade to code",
        "New installation (build/renovation)",
        "EV charging station",
        "Electrical inspection (sale/rental)",
      ],
    },
  },
  PLOMBIER: {
    label: { fr: "Plombier / chauffagiste", en: "Plumber / heating engineer" },
    needs: {
      fr: [
        "Fuite d'eau",
        "Panne chauffe-eau / chaudière",
        "Installation salle de bains",
        "Débouchage canalisation",
        "Entretien chaudière / contrat annuel",
      ],
      en: [
        "Water leak",
        "Water heater / boiler breakdown",
        "Bathroom installation",
        "Drain unblocking",
        "Boiler maintenance / annual contract",
      ],
    },
  },
  MACON: {
    label: { fr: "Maçon", en: "Mason" },
    needs: {
      fr: [
        "Fondations / gros œuvre",
        "Extension de maison",
        "Rénovation (mur, dalle, ouverture)",
        "Ravalement de façade",
        "Réponse à un appel d'offres",
      ],
      en: [
        "Foundations / structural work",
        "Home extension",
        "Renovation (wall, slab, opening)",
        "Facade restoration",
        "Tender / quote response",
      ],
    },
  },
  MENUISIER: {
    label: { fr: "Menuisier", en: "Joiner / carpenter" },
    needs: {
      fr: [
        "Fenêtres / volets",
        "Porte d'entrée / intérieure",
        "Placards / dressing sur-mesure",
        "Terrasse / pergola bois",
        "Réparation / remplacement",
      ],
      en: [
        "Windows / shutters",
        "Front / interior door",
        "Custom wardrobes / closets",
        "Wooden deck / pergola",
        "Repair / replacement",
      ],
    },
  },
  CHARPENTIER: {
    label: { fr: "Charpentier", en: "Roofer / framer" },
    needs: {
      fr: [
        "Charpente neuve",
        "Rénovation / renforcement charpente",
        "Aménagement de combles",
        "Traitement bois (insectes/humidité)",
        "Réparation suite dégât (tempête, fuite)",
      ],
      en: [
        "New roof frame",
        "Frame renovation / reinforcement",
        "Attic conversion",
        "Wood treatment (pests/moisture)",
        "Storm / leak damage repair",
      ],
    },
  },
  SERRURIER: {
    label: { fr: "Serrurier", en: "Locksmith" },
    needs: {
      fr: [
        "Ouverture de porte (urgence)",
        "Changement de serrure",
        "Installation porte blindée",
        "Reproduction de clés",
        "Dépannage volet roulant",
      ],
      en: [
        "Emergency door opening",
        "Lock replacement",
        "Security door installation",
        "Key duplication",
        "Roller shutter repair",
      ],
    },
  },
  PLAQUISTE: {
    label: { fr: "Plaquiste", en: "Drywall installer" },
    needs: {
      fr: [
        "Cloisons intérieures",
        "Faux plafond",
        "Isolation intérieure",
        "Rénovation après dégât des eaux",
        "Aménagement de combles",
      ],
      en: [
        "Interior partitions",
        "Suspended ceiling",
        "Interior insulation",
        "Post-water damage renovation",
        "Attic conversion",
      ],
    },
  },
  PEINTRE: {
    label: { fr: "Peintre", en: "Painter" },
    needs: {
      fr: [
        "Peinture intérieure (pièce/logement)",
        "Façade extérieure",
        "Revêtement mural (papier peint, enduit décoratif)",
        "Ravalement + peinture",
        "Rafraîchissement avant vente/location",
      ],
      en: [
        "Interior painting (room/home)",
        "Exterior facade",
        "Wall covering (wallpaper, decorative plaster)",
        "Facade restoration + painting",
        "Refresh before sale/rental",
      ],
    },
  },
  PAYSAGISTE: {
    label: { fr: "Paysagiste", en: "Landscaper" },
    needs: {
      fr: [
        "Création de jardin",
        "Entretien régulier (tonte, taille)",
        "Aménagement extérieur (terrasse, allée)",
        "Élagage / abattage",
        "Arrosage automatique / piscine naturelle",
      ],
      en: [
        "Garden design",
        "Regular maintenance (mowing, pruning)",
        "Outdoor layout (deck, path)",
        "Tree pruning / removal",
        "Automatic irrigation / natural pool",
      ],
    },
  },
  COUVREUR: {
    label: { fr: "Couvreur", en: "Roofer" },
    needs: {
      fr: [
        "Fuite toiture (urgence)",
        "Réfection de toiture",
        "Isolation combles perdus",
        "Nettoyage / démoussage",
        "Zinguerie / gouttières",
      ],
      en: [
        "Roof leak (emergency)",
        "Roof replacement",
        "Loft insulation",
        "Cleaning / moss removal",
        "Metalwork / gutters",
      ],
    },
  },
  CARRELEUR: {
    label: { fr: "Carreleur", en: "Tiler" },
    needs: {
      fr: [
        "Pose sol intérieur",
        "Pose salle de bains / douche",
        "Pose extérieure (terrasse)",
        "Rénovation joints / réparation",
        "Pose murale (cuisine, crédence)",
      ],
      en: [
        "Indoor floor tiling",
        "Bathroom / shower tiling",
        "Outdoor tiling (patio)",
        "Grout renovation / repair",
        "Wall tiling (kitchen, backsplash)",
      ],
    },
  },
};
