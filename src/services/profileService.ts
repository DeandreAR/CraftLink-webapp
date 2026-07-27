import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthResult } from "@/domain/auth";
import type { CreateProfileInput, Profile } from "@/domain/profile";
import { parseStoredVitrineConfig } from "@/domain/vitrinePresentation";
import { parsePageSlugChangeDates } from "@/domain/pageSlugQuota";
import { normalizeCertifications } from "@/lib/profile/normalizeCertifications";
import {
  DEFAULT_PLAN_TIER,
  SIGNUP_PLAN_TIER_CANDIDATES,
} from "@/config/planTier";
import {
  computeTrialEndsAt,
} from "@/domain/proAccess";
import { formatAuthDebugMessage, logAuthError } from "@/lib/auth/debugError";

const PROFILE_COLUMNS = [
  "id",
  "workspace_id",
  "role",
  "full_name",
  "whatsapp_number",
  "plan_tier",
  "page_slug",
  "page_slug_change_dates",
  "onboarding_completed_at",
  "whatsapp_clicks_this_month",
  "whatsapp_clicks_month_key",
  "voice_capture_enabled",
  "stripe_customer_id",
  "stripe_subscription_id",
  "trial_ends_at",
  "is_subscribed",
  "ai_generations_count",
  "vitrine_presentation",
  "certifications",
  "created_at",
  "updated_at",
] as const;

const RETRYABLE_INSERT_CODES = new Set(["42703", "22P02"]);

/** PostgREST / Postgres : column profiles.foo does not exist */
function parseMissingProfileColumn(message: string | undefined): string | null {
  if (!message) return null;
  const match = message.match(/column (?:profiles\.)?([a-z_][a-z0-9_]*) does not exist/i);
  return match?.[1] ?? null;
}

function mapProfile(row: Record<string, unknown>): Profile {
  const id = String(row.id);
  return {
    id,
    workspace_id: row.workspace_id != null ? String(row.workspace_id) : id,
    role: (row.role as Profile["role"]) ?? "ADMIN",
    plan_tier: (row.plan_tier as Profile["plan_tier"]) ?? DEFAULT_PLAN_TIER,
    full_name: (row.full_name as string | null) ?? null,
    whatsapp_number: (row.whatsapp_number as string | null) ?? null,
    page_slug: (row.page_slug as string | null) ?? null,
    page_slug_change_dates: parsePageSlugChangeDates(row.page_slug_change_dates),
    onboarding_completed_at: (row.onboarding_completed_at as string | null) ?? null,
    whatsapp_clicks_this_month:
      typeof row.whatsapp_clicks_this_month === "number"
        ? row.whatsapp_clicks_this_month
        : 0,
    whatsapp_clicks_month_key: (row.whatsapp_clicks_month_key as string | null) ?? null,
    voice_capture_enabled:
      typeof row.voice_capture_enabled === "boolean"
        ? row.voice_capture_enabled
        : undefined,
    stripe_customer_id: (row.stripe_customer_id as string | null) ?? null,
    stripe_subscription_id: (row.stripe_subscription_id as string | null) ?? null,
    trial_ends_at: (row.trial_ends_at as string | null) ?? null,
    is_subscribed: row.is_subscribed === true,
    ai_generations_count:
      typeof row.ai_generations_count === "number" ? row.ai_generations_count : 0,
    vitrine_presentation: row.vitrine_presentation
      ? parseStoredVitrineConfig(row.vitrine_presentation)
      : null,
    certifications: normalizeCertifications(row.certifications),
    created_at: (row.created_at as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
  };
}

function profileInsertPayloads(input: CreateProfileInput): Record<string, unknown>[] {
  const { userId, fullName, proPhoneNumber } = input;
  const trialEndsAt = computeTrialEndsAt();
  const optional = {
    ...(fullName?.trim() ? { full_name: fullName.trim() } : {}),
    ...(proPhoneNumber?.trim()
      ? { whatsapp_number: proPhoneNumber.trim() }
      : {}),
    trial_ends_at: trialEndsAt,
    is_subscribed: false,
  };

  const payloads: Record<string, unknown>[] = [];

  for (const planTier of SIGNUP_PLAN_TIER_CANDIDATES) {
    payloads.push({
      id: userId,
      workspace_id: userId,
      role: "ADMIN",
      plan_tier: planTier,
      ...(planTier === "PRO" ? { voice_capture_enabled: true } : {}),
      ...optional,
    });
  }

  payloads.push(
    { id: userId, workspace_id: userId, role: "ADMIN", ...optional },
    { id: userId, workspace_id: userId, role: "ADMIN" },
    { id: userId, role: "ADMIN" },
    { id: userId },
  );

  return payloads;
}

async function selectProfile(
  supabase: SupabaseClient,
  userId: string,
  columns: string,
) {
  return supabase.from("profiles").select(columns).eq("id", userId).maybeSingle();
}

async function selectProfileWithFallback(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ data: Record<string, unknown> | null; error: { code?: string; message?: string } | null }> {
  let columns: string[] = [...PROFILE_COLUMNS];
  let lastError: { code?: string; message?: string } | null = null;
  const droppedColumns: string[] = [];

  while (columns.length > 0) {
    const selectList = columns.join(", ");
    const { data, error } = await selectProfile(supabase, userId, selectList);

    if (!error) {
      if (droppedColumns.length > 0 && process.env.NODE_ENV === "development") {
        console.warn(
          `[profiles.select] Schéma partiel — colonnes absentes ignorées: ${droppedColumns.join(", ")}. Appliquez les migrations Supabase en attente.`,
        );
      }
      return { data: data as Record<string, unknown> | null, error: null };
    }

    lastError = error;

    if (error.code !== "42703") {
      break;
    }

    const missing = parseMissingProfileColumn(error.message);
    if (!missing || !columns.includes(missing)) {
      break;
    }

    droppedColumns.push(missing);
    columns = columns.filter((column) => column !== missing);
  }

  return { data: null, error: lastError };
}

async function insertProfileWithFallback(
  supabase: SupabaseClient,
  input: CreateProfileInput,
): Promise<{ ok: true } | { ok: false; error: { code?: string; message?: string } }> {
  let lastError: { code?: string; message?: string } | null = null;

  for (const payload of profileInsertPayloads(input)) {
    const { error } = await supabase.from("profiles").insert(payload);

    if (!error) {
      return { ok: true };
    }

    lastError = error;
    if (error.code === "23505") {
      return { ok: true };
    }
    if (RETRYABLE_INSERT_CODES.has(error.code ?? "")) {
      logAuthError(
        "createProfileForNewUser",
        `Insert rejeté (${error.code}) — retry sans ${Object.keys(payload).join(", ")}.`,
      );
      continue;
    }
    break;
  }

  return { ok: false, error: lastError ?? { message: "Insert failed" } };
}

async function ensureTrialEndsAtIfMissing(
  supabase: SupabaseClient,
  userId: string,
  profile: Profile,
): Promise<Profile> {
  if (profile.trial_ends_at || profile.is_subscribed) {
    return profile;
  }

  const trialEndsAt = computeTrialEndsAt();
  const { error } = await supabase
    .from("profiles")
    .update({
      trial_ends_at: trialEndsAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return profile;
  }

  return { ...profile, trial_ends_at: trialEndsAt };
}

/**
 * Crée le profil artisan : workspace solo = user.id, rôle ADMIN.
 * Si le trigger `on_auth_user_created` a déjà inséré la ligne, on la récupère.
 */
export async function createProfileForNewUser(
  supabase: SupabaseClient,
  input: CreateProfileInput,
): Promise<AuthResult<Profile>> {
  const { userId } = input;

  const existing = await getProfileByUserId(supabase, userId);
  if (existing.ok && existing.data) {
    const withTrial = await ensureTrialEndsAtIfMissing(supabase, userId, existing.data);
    return { ok: true, data: withTrial };
  }
  if (!existing.ok) {
    return existing;
  }

  const insertResult = await insertProfileWithFallback(supabase, input);
  if (!insertResult.ok) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "profiles.insert",
        insertResult.error,
        "Impossible de créer votre espace artisan. Réessayez ou contactez le support.",
      ),
      code: insertResult.error.code,
    };
  }

  const profile = await getProfileByUserId(supabase, userId);
  if (!profile.ok) {
    return profile;
  }
  if (!profile.data) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "profiles.insert",
        null,
        "Impossible de finaliser votre inscription. Réessayez ou contactez le support.",
      ),
    };
  }

  return { ok: true, data: profile.data };
}

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<AuthResult<Profile | null>> {
  const { data, error } = await selectProfileWithFallback(supabase, userId);

  if (error) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "profiles.select",
        error,
        "Impossible de charger votre profil.",
      ),
      code: error.code,
    };
  }

  if (!data) {
    return { ok: true, data: null };
  }

  return { ok: true, data: mapProfile(data) };
}
