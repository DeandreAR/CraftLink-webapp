"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
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
import { signOut } from "@/services/authService";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export type UpdateDashboardProfileInput = {
  fullName: string;
  phone: string;
  vitrine: StoredVitrineConfig;
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
    .select("plan_tier, whatsapp_clicks_this_month, whatsapp_clicks_month_key")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return { ok: false, message: error?.message ?? "Profil introuvable." };
  }

  const plan = resolveCraftlinkPlan(String(profile.plan_tier ?? ""));
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
    .select("plan_tier, whatsapp_clicks_this_month, whatsapp_clicks_month_key")
    .eq("id", user.id)
    .maybeSingle();

  if (readError || !profile) {
    return { ok: false, message: readError?.message ?? "Profil introuvable." };
  }

  const plan = resolveCraftlinkPlan(String(profile.plan_tier ?? ""));
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
    .select("plan_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return { ok: false, message: "Profil introuvable." };
  }

  if (resolveCraftlinkPlan(String(profile.plan_tier)) !== "PRO") {
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
