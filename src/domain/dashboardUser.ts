import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { Profile } from "@/domain/profile";
import { currentWhatsappMonthKey, normalizeWhatsappClickCount } from "@/lib/dashboard/whatsappQuota";

/** État métier dashboard dérivé du profil artisan. */
export type DashboardUser = {
  plan: CraftlinkPlan;
  whatsappClicksThisMonth: number;
  voiceCaptureEnabled: boolean;
};

export function profileToDashboardUser(profile: Profile): DashboardUser {
  const monthKey = profile.whatsapp_clicks_month_key;
  const clicks = profile.whatsapp_clicks_this_month ?? 0;

  return {
    plan: resolveCraftlinkPlan(profile.plan_tier),
    whatsappClicksThisMonth: normalizeWhatsappClickCount(clicks, monthKey),
    voiceCaptureEnabled: profile.voice_capture_enabled === true,
  };
}

export function whatsappMonthKeyForPersist(): string {
  return currentWhatsappMonthKey();
}
