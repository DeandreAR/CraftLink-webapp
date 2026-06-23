import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export type OnboardingImportSource = "gmb" | "instagram" | "facebook";

/** Données brutes normalisées issues des APIs d'import onboarding. */
export type OnboardingImportData = {
  source: OnboardingImportSource;
  businessName: string;
  category?: string;
  biographyOrDesc?: string;
};

/** Métiers cibles détectables (séparés des clés vitrine pour gérer les chevauchements). */
export type DetectableTradeKey =
  | "ELECTRICIEN"
  | "PLOMBIER"
  | "CHAUFFAGISTE"
  | "MACON"
  | "PEINTRE"
  | "MENUISIER";

export type JobDetectionWeights = {
  /** Nom d'entreprise ou catégorie GMB / Facebook */
  primary: number;
  /** Bio, description ou à-propos */
  secondary: number;
};

export type TradeKeywordRule =
  | { kind: "includes"; value: string }
  | { kind: "regex"; pattern: RegExp };

export type TradeKeywordSet = {
  includes: readonly string[];
  regexes: readonly RegExp[];
};

export const TRADE_TO_METIER_KEY: Record<DetectableTradeKey, MetierKey> = {
  ELECTRICIEN: "ELECTRICIEN",
  PLOMBIER: "PLOMBIER",
  /** Chauffagiste partage la fiche vitrine Plomberie / Chauffage */
  CHAUFFAGISTE: "PLOMBIER",
  MACON: "MACON",
  PEINTRE: "PEINTRE",
  MENUISIER: "MENUISIER",
};
