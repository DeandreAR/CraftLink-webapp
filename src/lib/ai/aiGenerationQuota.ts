import "server-only";

import type { ProAccessProfile } from "@/domain/proAccess";
import { createClient } from "@/lib/supabase/server";

export const MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL = 2;
export const MAX_AI_GENERATIONS_PRO = 3;

export const AI_GENERATION_QUOTA_EXCEEDED = "AI_GENERATION_QUOTA_EXCEEDED" as const;

export const AI_GENERATION_QUOTA_MESSAGE =
  "Vous avez atteint votre quota de générations IA. Modifiez directement votre page dans votre espace ou passez à l'offre Pro pour jusqu'à 3 générations par mois.";

export function getMaxAiGenerations(profile: ProAccessProfile): number {
  if (profile.is_subscribed === true) {
    return MAX_AI_GENERATIONS_PRO;
  }
  return MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL;
}

export function normalizeAiGenerationsCount(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return 0;
  }
  return Math.max(0, Math.min(MAX_AI_GENERATIONS_PRO, Math.round(raw)));
}

export function aiGenerationsRemaining(count: number, max: number): number {
  return Math.max(0, max - normalizeAiGenerationsCount(count));
}

export function canUseAiGeneration(
  profile: ProAccessProfile,
  aiGenerationsCount: number,
): boolean {
  const max = getMaxAiGenerations(profile);
  return normalizeAiGenerationsCount(aiGenerationsCount) < max;
}

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
