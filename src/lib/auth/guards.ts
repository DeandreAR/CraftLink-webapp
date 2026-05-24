import { redirect } from "next/navigation";
import { authPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithProfile } from "@/services/authService";
import type { Locale } from "@/i18n/config";

/** Redirige vers la connexion si pas de session + profil. */
export async function requireSessionProfile(lang: Locale) {
  const supabase = await createClient();
  const session = await getSessionWithProfile(supabase);

  if (!session.ok) {
    redirect(authPath(lang, "login"));
  }

  if (!session.data) {
    redirect(authPath(lang, "login"));
  }

  return session.data;
}
