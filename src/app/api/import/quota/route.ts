import { NextResponse } from "next/server";
import {
  aiGenerationsRemaining,
  getMaxAiGenerations,
  normalizeAiGenerationsCount,
} from "@/lib/ai/aiGenerationQuota";
import { getImportAuthContext } from "@/lib/onboarding/proImport/api/importAuth";
import { loadSubscriptionBillingForUser } from "@/lib/stripe/loadSubscriptionBilling";

export async function GET() {
  const auth = await getImportAuthContext();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const billing = await loadSubscriptionBillingForUser(auth.userId);
  const max = getMaxAiGenerations(auth.planTier, billing);
  const used = normalizeAiGenerationsCount(auth.aiGenerationsCount);
  const remaining = aiGenerationsRemaining(used, max);

  return NextResponse.json({
    used,
    remaining,
    max,
    unlimited: false,
    aiGenerationsCount: used,
    aiGenerationsRemaining: remaining,
  });
}
