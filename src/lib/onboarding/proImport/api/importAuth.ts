import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { IMPORT_AUTH_REQUIRED } from "@/lib/onboarding/proImport/api/constants";

export type ImportAuthContext = {
  userId: string;
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
    .select("vitrine_presentation")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: IMPORT_AUTH_REQUIRED }, { status: 401 });
  }

  return {
    userId: user.id,
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
