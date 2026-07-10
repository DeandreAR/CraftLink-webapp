import type {
  ComparisonRowJson,
  FeatureMatrixRowJson,
  PricingComparisonDictionary,
  TierJson,
} from "@/i18n/types";

export type TierKey = "essential" | "pro";

export type PricingTierView = {
  tierKey: TierKey;
  name: string;
  pitch: string;
  cta: string;
  hrefSuffix: string;
  featured: boolean;
  badge?: string;
};

export type PricingSectionModel = {
  copy: PricingComparisonDictionary;
  comparisonRows: ComparisonRowJson[];
  tiers: PricingTierView[];
  featureMatrix: FeatureMatrixRowJson[];
  proAdvantages: string[];
};

function mapTier(
  tierKey: TierKey,
  tier: TierJson,
  featured: boolean,
): PricingTierView {
  return {
    tierKey,
    name: tier.name,
    pitch: tier.pitch,
    cta: tier.cta,
    hrefSuffix: tier.href,
    featured,
    badge: tier.badge,
  };
}

/** Prépare les données d’affichage pour la section tarifs / comparaison (évolution pricing côté service possible sans toucher au JSX). */
export function buildPricingSectionModel(
  input: PricingComparisonDictionary,
): PricingSectionModel {
  return {
    copy: input,
    comparisonRows: input.comparisonRows,
    tiers: [
      mapTier("essential", input.tierEssential, false),
      mapTier("pro", input.tierPro, true),
    ],
    featureMatrix: input.featureMatrix,
    proAdvantages: input.proAdvantages,
  };
}
