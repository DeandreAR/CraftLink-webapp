import "server-only";

import { createClient } from "@/lib/supabase/server";
import { normalizeAiGenerationsCount } from "@/lib/ai/aiGenerationQuotaShared";

export {
  MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL,
  MAX_AI_GENERATIONS_PRO,
  AI_GENERATION_QUOTA_EXCEEDED,
  AI_GENERATION_QUOTA_MESSAGE,
  getMaxAiGenerations,
  normalizeAiGenerationsCount,
  aiGenerationsRemaining,
  canUseAiGeneration,
} from "@/lib/ai/aiGenerationQuotaShared";

export async function incrementAiGenerationsCount(userId: string): Promise<number | null> {
  const supabase = await createClient();
  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("ai_generations_count")
    .eq("id", userId)
    .maybeSingle();

  if (readError) {
    return null;
  }

  const current = normalizeAiGenerationsCount(profile?.ai_generations_count);
  const next = current + 1;

  const { error: writeError } = await supabase
    .from("profiles")
    .update({
      ai_generations_count: next,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (writeError) {
    return null;
  }

  return next;
}
