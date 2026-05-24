import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithProfile } from "@/services/authService";

export type PrepareAuthPageResult =
  | { status: "unavailable" }
  | { status: "ready" };

/** Vérifie la config, redirige si déjà connecté, sinon affiche le formulaire. */
export async function prepareAuthPage(
  lang: Locale,
): Promise<PrepareAuthPageResult> {
  if (!getSupabaseConfig()) {
    return { status: "unavailable" };
  }

  const supabase = await createClient();
  const session = await getSessionWithProfile(supabase);
  if (session.ok && session.data) {
    redirect(authPath(lang, "dashboard"));
  }

  return { status: "ready" };
}
