import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { isOnboardingComplete, resolvePostAuthPath } from "@/lib/auth/onboardingStatus";
import {
  loadOnboardingResume,
  type OnboardingResumeState,
} from "@/lib/onboarding/loadOnboardingResume";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithProfile } from "@/services/authService";

export type PrepareOnboardingPageResult = {
  resume: OnboardingResumeState | null;
};

/** Onboarding réservé aux comptes connectés sans page publiée. */
export async function prepareOnboardingPage(
  lang: Locale,
): Promise<PrepareOnboardingPageResult> {
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

  return {
    resume: loadOnboardingResume(session.data.profile),
  };
}
