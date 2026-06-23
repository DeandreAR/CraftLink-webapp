"use server";

import { createClient } from "@/lib/supabase/server";

/** Marque l’onboarding comme terminé (idempotent). */
export async function markOnboardingCompleteAction(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .is("onboarding_completed_at", null);

  if (error) {
    return { ok: false };
  }

  return { ok: true };
}
