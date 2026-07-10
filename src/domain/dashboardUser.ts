import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import { resolveVoiceCaptureEnabled } from "@/lib/dashboard/voiceCaptureDefault";
import type { Profile } from "@/domain/profile";
import type { UserProfile } from "@/domain/userProfile";
import { currentWhatsappMonthKey, normalizeWhatsappClickCount } from "@/lib/dashboard/whatsappQuota";

/** État métier dashboard dérivé du profil artisan. */
export type DashboardUser = UserProfile & {
  voiceCaptureEnabled: boolean;
};

export function profileToDashboardUser(profile: Profile): DashboardUser {
  const monthKey = profile.whatsapp_clicks_month_key;
  const clicks = profile.whatsapp_clicks_this_month ?? 0;

  return {
    plan: resolveCraftlinkPlan(profile.plan_tier),
    whatsappClicksThisMonth: normalizeWhatsappClickCount(clicks, monthKey),
    voiceCaptureEnabled: resolveVoiceCaptureEnabled(
      profile.plan_tier,
      profile.voice_capture_enabled,
    ),
  };
}

export function whatsappMonthKeyForPersist(): string {
  return currentWhatsappMonthKey();
}
