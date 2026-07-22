import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { STRIPE_FREE_PLAN_TIER } from "@/lib/stripe/updateProfilePlan";

export type TrialCronProfileRow = {
  id: string;
  full_name: string | null;
  trial_ends_at: string;
  trial_email_mid_sent_at: string | null;
  trial_email_warning_sent_at: string | null;
  trial_email_expired_sent_at: string | null;
};

export async function finalizeExpiredTrialProfile(
  admin: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await admin
    .from("profiles")
    .update({
      plan_tier: STRIPE_FREE_PLAN_TIER,
      voice_capture_enabled: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .eq("is_subscribed", false);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function countWorkspaceLeads(
  admin: SupabaseClient,
  workspaceId: string,
): Promise<number> {
  const { count, error } = await admin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (error || count == null) {
    return 0;
  }

  return count;
}

export async function markTrialEmailSent(
  admin: SupabaseClient,
  userId: string,
  field:
    | "trial_email_mid_sent_at"
    | "trial_email_warning_sent_at"
    | "trial_email_expired_sent_at",
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await admin
    .from("profiles")
    .update({
      [field]: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function resolveUserEmail(
  admin: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) {
    return null;
  }
  return data.user.email.trim() || null;
}
