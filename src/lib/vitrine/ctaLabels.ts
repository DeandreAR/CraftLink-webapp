import type { PublicPlanTier, VitrineCtaLabels } from "@/domain/vitrine";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";

export const DEFAULT_PRIMARY_QUOTE_LABEL = "Demander un Devis";

export function resolvePrimaryQuoteLabel(
  planTier: PublicPlanTier,
  cta: VitrineCtaLabels,
): string {
  if (!isProPublicPlan(planTier)) {
    return DEFAULT_PRIMARY_QUOTE_LABEL;
  }

  return cta.primaryQuote?.trim() || DEFAULT_PRIMARY_QUOTE_LABEL;
}
