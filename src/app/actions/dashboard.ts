"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { resolveCraftlinkPlanFromAccess } from "@/lib/dashboard/planAccess";
import { isProUser } from "@/domain/proAccess";
import type { StoredVitrineConfig } from "@/domain/vitrinePresentation";
import {
  canOpenWhatsAppContact,
  currentWhatsappMonthKey,
  ESSENTIAL_WHATSAPP_CLICK_LIMIT,
  normalizeWhatsappClickCount,
  whatsappClicksRemaining,
} from "@/lib/dashboard/whatsappQuota";
import { authPath } from "@/lib/auth/paths";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizeCertifications } from "@/lib/profile/normalizeCertifications";
import { syncProfilePlanFromStripeIfNeeded } from "@/lib/stripe/syncProfilePlanFromStripe";
import { signOut } from "@/services/authService";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import {
  appendPageSlugChangeDate,
  getPageSlugChangeQuota,
  parsePageSlugChangeDates,
} from "@/domain/pageSlugQuota";
import { checkPageSlugAvailability } from "@/lib/onboarding/pageSlugAvailability";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";

export type UpdateDashboardProfileInput = {
  fullName: string;
  phone: string;
  vitrine: StoredVitrineConfig;
  certifications: string[];
};

export type UpdateDashboardProfileResult =
  | { ok: true }
  | { ok: false; message: string };

export async function updateDashboardProfileAction(
  input: UpdateDashboardProfileInput,
): Promise<UpdateDashboardProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName.trim() || null,
      whatsapp_number: input.phone.trim() || null,
      vitrine_presentation: input.vitrine,
      certifications: normalizeCertifications(input.certifications),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("page_slug")
    .eq("id", user.id)
    .maybeSingle();

  revalidatePath("/dashboard");
  revalidatePath("/[lang]/dashboard", "page");

  const slug = (profile?.page_slug as string | null)?.trim();
  if (slug) {
    revalidatePath(`/${slug}`);
    revalidatePath(`/v/${slug}`);
    revalidateTag(`vitrine:${slug}`, "max");
  }

  return { ok: true };
}

export type RegisterWhatsAppClickResult =
  | { ok: true; allowed: true; clicks: number }
  | { ok: true; allowed: false; clicks: number }
  | { ok: false; message: string };

export type WhatsAppQuotaSnapshot = {
  plan: "ESSENTIEL" | "PRO";
  clicks: number;
  limit: number;
  remaining: number | null;
};

export async function getWhatsAppQuotaAction(): Promise<
  { ok: true; quota: WhatsAppQuotaSnapshot } | { ok: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("plan_tier, whatsapp_clicks_this_month, whatsapp_clicks_month_key, is_subscribed, trial_ends_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return { ok: false, message: error?.message ?? "Profil introuvable." };
  }

  const plan = resolveCraftlinkPlanFromAccess(profile);
  const clicks = normalizeWhatsappClickCount(
    Number(profile.whatsapp_clicks_this_month ?? 0),
    profile.whatsapp_clicks_month_key as string | null,
  );

  return {
    ok: true,
    quota: {
      plan,
      clicks,
      limit: ESSENTIAL_WHATSAPP_CLICK_LIMIT,
      remaining: whatsappClicksRemaining(plan, clicks),
    },
  };
}

export async function registerWhatsAppClickAction(): Promise<RegisterWhatsAppClickResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("plan_tier, whatsapp_clicks_this_month, whatsapp_clicks_month_key, is_subscribed, trial_ends_at")
    .eq("id", user.id)
    .maybeSingle();

  if (readError || !profile) {
    return { ok: false, message: readError?.message ?? "Profil introuvable." };
  }

  const plan = resolveCraftlinkPlanFromAccess(profile);
  const monthKey = currentWhatsappMonthKey();
  const currentClicks = normalizeWhatsappClickCount(
    Number(profile.whatsapp_clicks_this_month ?? 0),
    profile.whatsapp_clicks_month_key as string | null,
  );

  if (!canOpenWhatsAppContact(plan, currentClicks)) {
    return { ok: true, allowed: false, clicks: currentClicks };
  }

  if (plan === "PRO") {
    return { ok: true, allowed: true, clicks: currentClicks };
  }

  const nextClicks = currentClicks + 1;
  const { error: writeError } = await supabase
    .from("profiles")
    .update({
      whatsapp_clicks_this_month: nextClicks,
      whatsapp_clicks_month_key: monthKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (writeError) {
    return { ok: false, message: writeError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/[lang]/dashboard", "page");

  return { ok: true, allowed: true, clicks: nextClicks };
}

export type UpdateVoiceCaptureResult = { ok: true } | { ok: false; message: string };

export async function updateVoiceCaptureAction(
  enabled: boolean,
): Promise<UpdateVoiceCaptureResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_tier, is_subscribed, trial_ends_at, stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return { ok: false, message: "Profil introuvable." };
  }

  await syncProfilePlanFromStripeIfNeeded(
    user.id,
    profile.plan_tier,
    profile.stripe_customer_id,
    profile.is_subscribed === true,
  );

  const { data: fresh } = await supabase
    .from("profiles")
    .select("plan_tier, is_subscribed, trial_ends_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!isProUser(fresh ?? profile)) {
    return { ok: false, message: "Capture vocale réservée au Plan Pro." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      voice_capture_enabled: enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/[lang]/dashboard", "page");

  return { ok: true };
}

export type DeleteAccountResult = { ok: true } | { ok: false; message: string };

export async function deleteAccountAction(locale: Locale): Promise<DeleteAccountResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const userId = user.id;

  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  const admin = createAdminClient();
  if (admin) {
    const { error: authError } = await admin.auth.admin.deleteUser(userId);
    if (authError) {
      return { ok: false, message: authError.message };
    }
  }

  await signOut(supabase);

  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  redirect(authPath(safeLocale, "login"));
}

export type ChangePageSlugResult =
  | {
      ok: true;
      slug: string;
      remaining: number;
    }
  | {
      ok: false;
      error:
        | "auth"
        | "invalid"
        | "taken"
        | "unchanged"
        | "quota"
        | "update_failed";
      message?: string;
      nextAvailableAt?: string | null;
      remaining?: number;
    };

/** Change l’URL publique (max 2 / 12 mois). L’ancienne URL cesse d’exister. */
export async function changePageSlugAction(
  rawSlug: string,
): Promise<ChangePageSlugResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, error: "auth" };
  }

  const normalized = sanitizePageSlugInput(rawSlug);
  const availability = await checkPageSlugAvailability(normalized, user.id);
  if (!availability.validation.ok) {
    return {
      ok: false,
      error: availability.validation.code === "taken" ? "taken" : "invalid",
    };
  }
  if (!availability.available) {
    return { ok: false, error: "taken" };
  }

  const { data: profile, error: loadError } = await supabase
    .from("profiles")
    .select("page_slug, page_slug_change_dates")
    .eq("id", user.id)
    .maybeSingle();

  if (loadError || !profile) {
    return { ok: false, error: "update_failed", message: loadError?.message };
  }

  const currentSlug = String(profile.page_slug ?? "").trim().toLowerCase();
  if (!currentSlug) {
    return { ok: false, error: "invalid" };
  }
  if (currentSlug === availability.normalized) {
    return { ok: false, error: "unchanged" };
  }

  const history = parsePageSlugChangeDates(profile.page_slug_change_dates);
  const quota = getPageSlugChangeQuota(history);
  if (quota.remaining <= 0) {
    return {
      ok: false,
      error: "quota",
      remaining: 0,
      nextAvailableAt: quota.nextAvailableAt,
    };
  }

  const nextHistory = appendPageSlugChangeDate(history);
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      page_slug: availability.normalized,
      page_slug_change_dates: nextHistory,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    return { ok: false, error: "update_failed", message: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/[lang]/dashboard", "page");
  revalidatePath(`/${currentSlug}`);
  revalidatePath(`/v/${currentSlug}`);
  revalidatePath(`/${availability.normalized}`);
  revalidatePath(`/v/${availability.normalized}`);

  const nextQuota = getPageSlugChangeQuota(nextHistory);
  return {
    ok: true,
    slug: availability.normalized,
    remaining: nextQuota.remaining,
  };
}
