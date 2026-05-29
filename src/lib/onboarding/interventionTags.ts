import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export const MAX_INTERVENTION_TAGS = 15;
export const INTERVENTION_RADIUS_OPTIONS = [10, 20, 30, 50, 75, 100] as const;

export const INTERVENTIONS_PAR_METIER = {
  ELECTRICIEN: [
    "Dépannage panne totale",
    "Mise aux normes (NF C 15-100)",
    "Remplacement de tableau électrique",
    "Installation de bornes de recharge (IRVE)",
    "Pose de motorisation de portail",
    "Installation domotique & maison connectée",
    "Ajout de prises et interrupteurs",
    "Éclairage intérieur & extérieur",
  ],
  PLOMBIER: [
    "Recherche et réparation de fuite",
    "Remplacement de chauffe-eau / ballon",
    "Rénovation complète de salle de bains",
    "Débouchage de canalisation urgent",
    "Pose de sanitaires (WC, lavabo, douche)",
    "Installation de pompe à chaleur / chaudière",
    "Entretien de système de chauffage",
    "Pose d'adoucisseur d'eau",
  ],
  MENUISIER: [
    "Pose de fenêtres (PVC, Alu, Bois)",
    "Installation de portes d'entrée / garage",
    "Pose de volets roulants & battants",
    "Création de dressing & placards sur-mesure",
    "Pose de parquet (flottant, massif)",
    "Aménagement de cuisine",
    "Installation de portail et clôture",
    "Création de terrasse en bois",
  ],
  SERRURIER: [
    "Ouverture de porte claquée / bloquée",
    "Remplacement de serrure après effraction",
    "Blindage de porte & haute sécurité",
    "Installation de serrure connectée",
    "Changement de cylindre / barillet",
    "Pose de verrou de sécurité",
    "Réparation de système de fermeture",
    "Double de clés minute",
  ],
  PLAQUISTE: [
    "Création de cloisons séparatrices",
    "Pose de faux plafonds",
    "Isolation thermique par l'intérieur (ITI)",
    "Isolation acoustique / phonique",
    "Aménagement de combles",
    "Doublage de murs",
    "Traitement des joints et bandes",
    "Réparation de plaques de plâtre endommagées",
  ],
  PEINTRE: [
    "Peinture intérieure (murs & plafonds)",
    "Pose de toile de verre / papier peint",
    "Peinture extérieure & ravalement façade",
    "Préparation et ratissage des supports",
    "Application d'enduits de finition",
    "Peinture sur boiseries / radiateurs",
    "Traitement des fissures",
    "Revêtement décoratif",
  ],
  PAYSAGISTE: [
    "Entretien de jardin (tonte, taille, élagage)",
    "Création et aménagement d'espaces verts",
    "Engazonnement (semis ou rouleau)",
    "Installation de système d'arrosage automatique",
    "Pose de clôtures & claustras",
    "Aménagement d'allées et pavage",
    "Création de massifs et plantations",
    "Terrassement léger",
  ],
  COUVREUR: [
    "Réparation de fuite de toiture",
    "Remplacement de tuiles / ardoises",
    "Nettoyage & démoussage de toit",
    "Étanchéité de toiture-terrasse",
    "Installation / remplacement de fenêtres de toit (Velux)",
    "Pose et nettoyage de gouttières (Zinguerie)",
    "Rénovation complète de couverture",
    "Isolation des combles par le toit",
  ],
  CARRELEUR: [
    "Pose de carrelage au sol intérieur",
    "Pose de faïence murale (crédence, douche)",
    "Pose de carrelage grand format",
    "Réalisation de douche à l'italienne",
    "Pose de carrelage extérieur / terrasse",
    "Ragréage et préparation des sols",
    "Remplacement de joints usés",
    "Pose de pierres naturelles / travertin",
  ],
  CHARPENTIER: [
    "Pose de charpente traditionnelle bois",
    "Installation de charpente fermette (industrielle)",
    "Traitement des bois de charpente",
    "Modification de structure pour combles",
    "Création d'ossature bois / extension",
    "Construction de carport / abri de jardin",
    "Rénovation de charpente ancienne",
    "Pose de solivage",
  ],
  MACON: [
    "Ouverture de mur porteur (pose IPN)",
    "Création de fondations & dalles béton",
    "Montage de murs (parpaings, briques)",
    "Création de murs de clôture",
    "Travaux de démolition intérieure",
    "Rénovation de maçonnerie ancienne",
    "Création d'extensions de maison",
    "Coffrage & ferraillage",
  ],
  RENOVATION_GENERALE: [
    "Rénovation complète appartement / maison",
    "Rénovation salle de bains clé en main",
    "Rénovation cuisine",
    "Ravalement & isolation extérieure",
    "Réagencement intérieur (cloisons, sols)",
    "Mise aux normes électriques & plomberie",
    "Extension & surélévation",
    "Second œuvre global (tous corps d'état)",
  ],
} as const satisfies Record<MetierKey, readonly string[]>;

export function getInterventionsForMetier(metierKey: MetierKey): readonly string[] {
  return INTERVENTIONS_PAR_METIER[metierKey];
}

/** @deprecated Utiliser getInterventionsForMetier — conservé pour compatibilité locale. */
export function getInterventionTagsForMetier(
  metierKey: MetierKey,
  _locale: "fr" | "en" = "fr",
): readonly string[] {
  return getInterventionsForMetier(metierKey);
}
