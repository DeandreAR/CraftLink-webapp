import "server-only";

import type { AudienceMetrics } from "@/domain/analytics";
import { EMPTY_AUDIENCE_METRICS, type AnalyticsEventType } from "@/domain/analytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const CONTACT_TYPES: AnalyticsEventType[] = [
  "click_whatsapp",
  "form_submit",
  "voice_sent",
];

/** Insert public (service role) — utilisé par /api/analytics/track. */
export async function insertAnalyticsEvent(
  profileId: string,
  eventType: AnalyticsEventType,
): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const { error } = await admin.from("analytics_events").insert({
    profile_id: profileId,
    event_type: eventType,
  });

  return !error;
}

/** Agrégats 30 jours pour le dashboard artisan (session user). */
export async function loadAudienceMetrics(
  profileId: string,
  days = 30,
): Promise<AudienceMetrics> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_type")
    .eq("profile_id", profileId)
    .gte("created_at", since.toISOString());

  if (error || !data) return { ...EMPTY_AUDIENCE_METRICS };

  const metrics = { ...EMPTY_AUDIENCE_METRICS };
  for (const row of data) {
    const type = String(row.event_type);
    if (type === "page_view") metrics.pageViews += 1;
    else if (type === "click_affiliate") metrics.materialClicks += 1;
    else if (type === "form_submit") {
      metrics.formSubmits += 1;
      metrics.contactClicks += 1;
    } else if (type === "voice_sent") {
      metrics.voiceSent += 1;
      metrics.contactClicks += 1;
    } else if (type === "click_whatsapp") {
      metrics.contactClicks += 1;
    }
  }

  return metrics;
}

export function isContactAnalyticsType(type: AnalyticsEventType): boolean {
  return CONTACT_TYPES.includes(type);
}
