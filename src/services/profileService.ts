import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthResult } from "@/domain/auth";
import type { CreateProfileInput, Profile } from "@/domain/profile";

const PROFILE_COLUMNS =
  "id, workspace_id, role, plan_tier, full_name, whatsapp_number, created_at, updated_at";

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    workspace_id: String(row.workspace_id),
    role: row.role as Profile["role"],
    plan_tier: row.plan_tier as Profile["plan_tier"],
    full_name: (row.full_name as string | null) ?? null,
    whatsapp_number: (row.whatsapp_number as string | null) ?? null,
    created_at: (row.created_at as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
  };
}

/**
 * Crée le profil artisan : workspace solo = user.id, rôle ADMIN, plan ALL_SOURCES.
 */
export async function createProfileForNewUser(
  supabase: SupabaseClient,
  input: CreateProfileInput,
): Promise<AuthResult<Profile>> {
  const { userId, fullName, whatsappNumber } = input;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      workspace_id: userId,
      role: "ADMIN",
      plan_tier: "ALL_SOURCES",
      full_name: fullName?.trim() || null,
      whatsapp_number: whatsappNumber?.trim() || null,
    })
    .select(PROFILE_COLUMNS)
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error:
          "Un profil existe déjà pour ce compte. Essayez de vous connecter.",
        code: error.code,
      };
    }
    return {
      ok: false,
      error:
        "Impossible de créer votre espace artisan. Réessayez ou contactez le support.",
      code: error.code,
    };
  }

  return { ok: true, data: mapProfile(data as Record<string, unknown>) };
}

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<AuthResult<Profile | null>> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      error: "Impossible de charger votre profil.",
      code: error.code,
    };
  }

  if (!data) {
    return { ok: true, data: null };
  }

  return { ok: true, data: mapProfile(data as Record<string, unknown>) };
}
