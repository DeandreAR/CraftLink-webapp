export {
  DEFAULT_JOB_DETECTION_WEIGHTS,
  OnboardingJobDetector,
  detectMetierFromImport,
  onboardingJobDetector,
} from "@/lib/onboarding/jobDetection/OnboardingJobDetector";
export { normalizeForJobMatching } from "@/lib/onboarding/jobDetection/textNormalization";
export { JOB_KEYWORD_REGISTRY, DETECTABLE_TRADE_KEYS } from "@/lib/onboarding/jobDetection/jobKeywordRegistry";
export type {
  DetectableTradeKey,
  JobDetectionWeights,
  OnboardingImportData,
  OnboardingImportSource,
  TradeKeywordRule,
  TradeKeywordSet,
} from "@/lib/onboarding/jobDetection/types";
export { TRADE_TO_METIER_KEY } from "@/lib/onboarding/jobDetection/types";
