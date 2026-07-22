import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { IMPORT_AUTH_REQUIRED } from "@/lib/onboarding/proImport/api/constants";

export type ImportAuthContext = {
  userId: string;
  planTier: string;
  aiGenerationsCount: number;
  vitrinePresentation: unknown;
};

export async function getImportAuthContext(): Promise<ImportAuthContext | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: IMPORT_AUTH_REQUIRED }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("plan_tier, ai_generations_count, vitrine_presentation")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: IMPORT_AUTH_REQUIRED }, { status: 401 });
  }

  return {
    userId: user.id,
    planTier: String(profile?.plan_tier ?? ""),
    aiGenerationsCount:
      typeof profile?.ai_generations_count === "number" ? profile.ai_generations_count : 0,
    vitrinePresentation: profile?.vitrine_presentation ?? null,
  };
}

export async function persistVitrinePresentation(
  userId: string,
  vitrinePresentation: unknown,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({
      vitrine_presentation: vitrinePresentation,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}
