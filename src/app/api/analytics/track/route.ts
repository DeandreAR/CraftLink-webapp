import { NextResponse } from "next/server";
import { isAnalyticsEventType } from "@/domain/analytics";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";
import { insertAnalyticsEvent } from "@/lib/analytics/analyticsEvents";
import { createAdminClient } from "@/lib/supabase/admin";

type TrackBody = {
  slug?: string;
  eventType?: string;
};

/**
 * Tracking public vitrine — résout le slug → profile_id puis insert (service role).
 */
export async function POST(request: Request) {
  let body: TrackBody;
  try {
    body = (await request.json()) as TrackBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const slug = sanitizePageSlugInput(body.slug ?? "");
  const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";

  if (!slug || !isAnalyticsEventType(eventType)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const { data: profile, error } = await admin
    .from("profiles")
    .select("id")
    .eq("page_slug", slug)
    .maybeSingle();

  if (error || !profile?.id) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const ok = await insertAnalyticsEvent(String(profile.id), eventType);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
