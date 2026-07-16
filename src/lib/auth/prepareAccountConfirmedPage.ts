import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { isOnboardingComplete, resolvePostAuthPath } from "@/lib/auth/onboardingStatus";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithProfile } from "@/services/authService";

/** Écran post-validation e-mail : session requise, onboarding non terminé. */
export async function prepareAccountConfirmedPage(lang: Locale): Promise<void> {
  if (!getSupabaseConfig()) {
    redirect(authPath(lang, "signup"));
  }

  const supabase = await createClient();
  const session = await getSessionWithProfile(supabase);

  if (!session.ok || !session.data) {
    redirect(authPath(lang, "signup"));
  }

  if (isOnboardingComplete(session.data.profile)) {
    redirect(resolvePostAuthPath(lang, session.data.profile));
  }
}
