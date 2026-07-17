import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import { validatePageSlug } from "@/lib/onboarding/pageSlug";
import {
  buildStoredVitrineFromOnboarding,
  type OnboardingProgressSnapshot,
} from "@/lib/vitrine/storedVitrinePresentation";
import { VOICE_CAPTURE_DEFAULT_FOR_PRO } from "@/lib/dashboard/voiceCaptureDefault";
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
  services: OnboardingService[],
  options: {
    setProPlan: boolean;
    markComplete: boolean;
    requireSlug: boolean;
    progress?: OnboardingProgressSnapshot | null;
  },
): Promise<PublishOnboardingResult> {
  const validation = validatePageSlug(profile.pageSlug);
  const slugReady = validation.ok && profile.pageSlugConfirmed;
  const slug = slugReady ? validation.normalized : "";

  if (options.requireSlug && !slugReady) {
    return { ok: false, message: "URL de page invalide." };
  }

  if (slugReady && !(await isSlugAvailableClient(slug))) {
    return { ok: false, message: SLUG_TAKEN_MESSAGE };
  }

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

    const progressForStore = options.markComplete
      ? null
      : (options.progress ?? undefined);

    const patch: Record<string, unknown> = {
      ...(options.setProPlan
        ? {
            plan_tier: "PRO",
            voice_capture_enabled: VOICE_CAPTURE_DEFAULT_FOR_PRO,
          }
        : {}),
      full_name: profile.businessName.trim() || null,
      whatsapp_number: profile.phone.trim() || null,
      vitrine_presentation: buildStoredVitrineFromOnboarding(
        profile,
        services,
        progressForStore,
      ),
      ...(options.markComplete
        ? { onboarding_completed_at: new Date().toISOString() }
        : {}),
      updated_at: new Date().toISOString(),
    };

    if (slugReady) {
      patch.page_slug = slug;
    }

    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);

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

  return { ok: true, slug: slug || profile.pageSlug.trim() };
}

/**
 * Sauvegarde progressive à chaque « Continuer » (sans exiger l’URL confirmée).
 * Ne marque pas l’onboarding comme terminé.
 */
export async function saveOnboardingProgress(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
  progress: OnboardingProgressSnapshot,
): Promise<PublishOnboardingResult> {
  return persistOnboardingProfile(profile, services, {
    setProPlan: false,
    markComplete: false,
    requireSlug: false,
    progress,
  });
}

/** Sauvegarde le brouillon avant redirection Stripe (sans activer PRO). */
export async function saveOnboardingDraft(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
): Promise<PublishOnboardingResult> {
  return persistOnboardingProfile(profile, services, {
    setProPlan: false,
    markComplete: false,
    requireSlug: true,
    progress: { wizard: "pro", phase: "validate", draftPlan: "PRO" },
  });
}

/**
 * Publie le profil onboarding : met à jour Supabase si session active.
 */
export async function publishOnboardingProfile(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
): Promise<PublishOnboardingResult> {
  return persistOnboardingProfile(profile, services, {
    setProPlan: profile.plan === "PRO",
    markComplete: true,
    requireSlug: true,
    progress: null,
  });
}
