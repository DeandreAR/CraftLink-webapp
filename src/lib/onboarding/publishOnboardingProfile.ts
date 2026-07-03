import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import { validatePageSlug } from "@/lib/onboarding/pageSlug";
import { buildStoredVitrineFromOnboarding } from "@/lib/vitrine/storedVitrinePresentation";
import { createClient } from "@/lib/supabase/client";

export type PublishOnboardingResult =
  | { ok: true; slug: string }
  | { ok: false; message: string };

const SLUG_TAKEN_MESSAGE = "Cette URL est déjà prise. Choisissez-en une autre.";

async function isSlugAvailableClient(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/onboarding/slug/check?slug=${encodeURIComponent(slug)}`);
    const data = (await res.json()) as { available: boolean };
    return data.available === true;
  } catch {
    return true;
  }
}

async function persistOnboardingProfile(
  profile: OnboardingProfileDraft,
  options: { setProPlan: boolean; markComplete: boolean },
): Promise<PublishOnboardingResult> {
  const validation = validatePageSlug(profile.pageSlug);
  if (!validation.ok || !profile.pageSlugConfirmed) {
    return { ok: false, message: "URL de page invalide." };
  }

  const slug = validation.normalized;

  if (!(await isSlugAvailableClient(slug))) {
    return { ok: false, message: SLUG_TAKEN_MESSAGE };
  }

  await new Promise((r) => setTimeout(r, 400));

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ok: false,
        message: "Connectez-vous pour publier votre page et accéder au paiement.",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        ...(options.setProPlan ? { plan_tier: "PRO" } : {}),
        full_name: profile.businessName.trim(),
        whatsapp_number: profile.phone.trim(),
        page_slug: slug,
        vitrine_presentation: buildStoredVitrineFromOnboarding(profile, services),
        ...(options.markComplete
          ? { onboarding_completed_at: new Date().toISOString() }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      if (error.code === "23505") {
        return { ok: false, message: SLUG_TAKEN_MESSAGE };
      }
      return { ok: false, message: error.message };
    }
  } catch {
    return {
      ok: false,
      message: "Impossible de sauvegarder le profil. Réessayez.",
    };
  }

  return { ok: true, slug };
}

/** Sauvegarde le brouillon avant redirection Stripe (sans activer PRO). */
export async function saveOnboardingDraft(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
): Promise<PublishOnboardingResult> {
  return persistOnboardingProfile(profile, { setProPlan: false, markComplete: false });
}

/**
 * Publie le profil onboarding : met à jour Supabase si session active.
 */
export async function publishOnboardingProfile(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
): Promise<PublishOnboardingResult> {
  return persistOnboardingProfile(profile, {
    setProPlan: profile.plan === "PRO",
    markComplete: true,
  });
}
