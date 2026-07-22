import { redirect } from "next/navigation";
import { isOnboardingComplete } from "@/lib/auth/onboardingStatus";
import { authPath } from "@/lib/auth/paths";
import { VOICE_CAPTURE_DEFAULT_FOR_PRO } from "@/lib/dashboard/voiceCaptureDefault";
import { isCraftlinkPro, resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import {
  resolveWorkspaceSession,
  type WorkspaceSession,
} from "@/lib/auth/sessionContext";
import { syncProfilePlanFromStripeIfNeeded } from "@/lib/stripe/syncProfilePlanFromStripe";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/config";

/** Redirige vers la connexion si pas de session + profil. */
export async function requireSessionProfile(
  lang: Locale,
): Promise<WorkspaceSession> {
  const supabase = await createClient();
  const session = await resolveWorkspaceSession(supabase);

  if (!session.ok) {
    redirect(authPath(lang, "login"));
  }

  if (!session.data) {
    redirect(authPath(lang, "login"));
  }

  if (!isOnboardingComplete(session.data.profile)) {
    redirect(authPath(lang, "onboarding"));
  }

  const synced = await syncProfilePlanFromStripeIfNeeded(
    session.data.user.id,
    session.data.profile.plan_tier,
    session.data.profile.stripe_customer_id,
  );
  if (synced.planTier) {
    session.data.profile.plan_tier = synced.planTier;
    if (isCraftlinkPro(resolveCraftlinkPlan(synced.planTier))) {
      session.data.profile.voice_capture_enabled = VOICE_CAPTURE_DEFAULT_FOR_PRO;
    }
  }
  if (synced.customerId) {
    session.data.profile.stripe_customer_id = synced.customerId;
  }
  if (synced.subscriptionId) {
    session.data.profile.stripe_subscription_id = synced.subscriptionId;
  }

  return session.data;
}
