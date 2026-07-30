"use server";

import { buildCalendarFeedUrls } from "@/lib/calendar/calendarFeed";
import { createClient } from "@/lib/supabase/server";

export type CalendarFeedResult =
  | {
      ok: true;
      httpsUrl: string;
      webcalUrl: string;
      googleSubscribeUrl: string;
    }
  | { ok: false; message: string };

/** Crée le token si besoin et renvoie l’URL d’abonnement calendrier (une seule fois). */
export async function ensureCalendarFeedAction(): Promise<CalendarFeedResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("calendar_feed_token")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  let token = (profile?.calendar_feed_token as string | null)?.trim() || "";

  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        calendar_feed_token: token,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return { ok: false, message: updateError.message };
    }
  }

  return { ok: true, ...buildCalendarFeedUrls(token) };
}

/** Régénère le token (invalide l’ancien lien d’abonnement). */
export async function regenerateCalendarFeedAction(): Promise<CalendarFeedResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  const { error } = await supabase
    .from("profiles")
    .update({
      calendar_feed_token: token,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, ...buildCalendarFeedUrls(token) };
}
