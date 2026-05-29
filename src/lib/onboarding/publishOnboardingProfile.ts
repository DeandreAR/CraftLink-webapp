import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import { createClient } from "@/lib/supabase/client";

export type PublishOnboardingResult =
  | { ok: true; slug: string }
  | { ok: false; message: string };

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "mon-activite"
  );
}

/**
 * Publie le profil onboarding : met à jour Supabase si session active, sinon simulation.
 */
export async function publishOnboardingProfile(
  profile: OnboardingProfileDraft,
  _services: OnboardingService[],
): Promise<PublishOnboardingResult> {
  const slug = slugify(profile.businessName.trim());
  await new Promise((r) => setTimeout(r, 900));

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          plan_tier: "PRO",
          full_name: profile.businessName.trim(),
          whatsapp_number: profile.phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        return {
          ok: false,
          message: error.message,
        };
      }
    }
  } catch {
    /* Client Supabase indisponible — on continue en mode démo */
  }

  return { ok: true, slug };
}
