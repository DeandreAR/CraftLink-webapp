import {
  DETECTABLE_TRADE_KEYS,
  JOB_KEYWORD_REGISTRY,
} from "@/lib/onboarding/jobDetection/jobKeywordRegistry";
import { normalizeForJobMatching } from "@/lib/onboarding/jobDetection/textNormalization";
import type {
  DetectableTradeKey,
  JobDetectionWeights,
  OnboardingImportData,
  TradeKeywordSet,
} from "@/lib/onboarding/jobDetection/types";
import { TRADE_TO_METIER_KEY } from "@/lib/onboarding/jobDetection/types";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export const DEFAULT_JOB_DETECTION_WEIGHTS: JobDetectionWeights = {
  primary: 2,
  secondary: 1,
};

function countKeywordMatches(text: string, keywords: TradeKeywordSet): number {
  if (!text.trim()) return 0;

  const normalized = normalizeForJobMatching(text);
  let score = 0;

  for (const keyword of keywords.includes) {
    const needle = normalizeForJobMatching(keyword);
    if (needle && normalized.includes(needle)) score += 1;
  }

  for (const pattern of keywords.regexes) {
    pattern.lastIndex = 0;
    if (pattern.test(normalized)) score += 1;
  }

  return score;
}

function scoreTrade(
  trade: DetectableTradeKey,
  primaryText: string,
  secondaryText: string,
  weights: JobDetectionWeights,
): number {
  const keywords = JOB_KEYWORD_REGISTRY[trade];
  return (
    countKeywordMatches(primaryText, keywords) * weights.primary +
    countKeywordMatches(secondaryText, keywords) * weights.secondary
  );
}

function buildPrimaryText(data: OnboardingImportData): string {
  return [data.businessName, data.category].filter(Boolean).join(" ");
}

export class OnboardingJobDetector {
  constructor(
    private readonly weights: JobDetectionWeights = DEFAULT_JOB_DETECTION_WEIGHTS,
  ) {}

  /** Scores bruts par métier détectable (utile pour debug / tests). */
  scoreAll(data: OnboardingImportData): Record<DetectableTradeKey, number> {
    const primaryText = buildPrimaryText(data);
    const secondaryText = data.biographyOrDesc?.trim() ?? "";

    const scores = {} as Record<DetectableTradeKey, number>;
    for (const trade of DETECTABLE_TRADE_KEYS) {
      scores[trade] = scoreTrade(trade, primaryText, secondaryText, this.weights);
    }
    return scores;
  }

  /**
   * Retourne le MetierKey vitrine ou `null` si score nul ou égalité parfaite
   * (l'onboarding affiche alors le menu déroulant de secours).
   */
  detect(data: OnboardingImportData): MetierKey | null {
    const scores = this.scoreAll(data);
    const entries = DETECTABLE_TRADE_KEYS.map((trade) => [trade, scores[trade]] as const);

    const maxScore = Math.max(...entries.map(([, score]) => score));
    if (maxScore <= 0) return null;

    const winners = entries.filter(([, score]) => score === maxScore);
    if (winners.length !== 1) return null;

    return TRADE_TO_METIER_KEY[winners[0][0]];
  }
}

/** Instance partagée — stateless, réutilisable dans les mappers serveur. */
export const onboardingJobDetector = new OnboardingJobDetector();

export function detectMetierFromImport(data: OnboardingImportData): MetierKey | null {
  return onboardingJobDetector.detect(data);
}
