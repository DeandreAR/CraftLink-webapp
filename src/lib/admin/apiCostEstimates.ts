/** Tarifs indicatifs OpenAI (USD) — à ajuster selon facturation réelle. */
const MODEL_RATES_USD_PER_1M = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "whisper-1": { input: 0, output: 0 },
} as const;

/** Whisper facturé à la minute (~0,006 USD/min) — estimation par requête vocale moyenne. */
const WHISPER_USD_PER_REQUEST = 0.008;

const USD_TO_EUR = 0.92;

/** Abonnement Pro mensuel HT (Bêta) pour le calcul de marge. */
export const PRO_MONTHLY_SUBSCRIPTION_EUR = 19;

export function estimateChatCostUsd(
  model: keyof typeof MODEL_RATES_USD_PER_1M | string,
  inputTokens: number,
  outputTokens: number,
): number {
  const rates = MODEL_RATES_USD_PER_1M[model as keyof typeof MODEL_RATES_USD_PER_1M];
  if (!rates) {
    return ((inputTokens + outputTokens) / 1_000_000) * 0.5;
  }
  return (
    (inputTokens / 1_000_000) * rates.input +
    (outputTokens / 1_000_000) * rates.output
  );
}

export function estimateWhisperCostUsd(requestCount: number): number {
  return requestCount * WHISPER_USD_PER_REQUEST;
}

export function usdToEur(amountUsd: number): number {
  return amountUsd * USD_TO_EUR;
}

/** Apify — Instagram (posts + abonnés), estimation par import réussi. */
export function estimateApifyInstagramImportUsd(): number {
  return 0.006;
}

/** Apify — Facebook posts scraper, estimation par import réussi. */
export function estimateApifyFacebookImportUsd(): number {
  return 0.004;
}

/** SerpApi — recherche Google Maps / avis, estimation par import réussi. */
export function estimateSerpApiGoogleImportUsd(): number {
  return 0.01;
}

/** Quota stockage Supabase gratuit (1 Go) — indicatif pour la jauge admin. */
export const SUPABASE_FREE_STORAGE_BYTES = 1_073_741_824;
