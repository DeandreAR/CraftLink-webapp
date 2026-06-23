import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { formatConfigDebugMessage, logAuthError } from "@/lib/auth/debugError";
import { resolvePostAuthPath } from "@/lib/auth/onboardingStatus";
import { authPath } from "@/lib/auth/paths";
import { rethrowIfNextNavigationError } from "@/lib/next/navigationErrors";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithProfile } from "@/services/authService";

export type PrepareAuthPageResult =
  | { status: "unavailable"; message: string }
  | { status: "ready" };

/** Vérifie la config, redirige si déjà connecté, sinon affiche le formulaire. */
export async function prepareAuthPage(
  lang: Locale,
): Promise<PrepareAuthPageResult> {
  if (!getSupabaseConfig()) {
    return {
      status: "unavailable",
      message: formatConfigDebugMessage(
        "supabase.config",
        "Variables placeholder détectées dans .env.local (ex. ton_url_supabase / ta_cle_anon). Remplacez par l’URL et la clé anon JWT du dashboard Supabase, sauvegardez le fichier, puis redémarrez npm run dev.",
      ),
    };
  }

  try {
    const supabase = await createClient();
    const session = await getSessionWithProfile(supabase);

    if (!session.ok) {
      logAuthError("prepareAuthPage.session", session.error);
    }

    if (session.ok && session.data) {
      redirect(resolvePostAuthPath(lang, session.data.profile));
    }
  } catch (error) {
    rethrowIfNextNavigationError(error);

    logAuthError("prepareAuthPage", error);
    return {
      status: "unavailable",
      message: formatConfigDebugMessage(
        "supabase.prepareAuthPage",
        error instanceof Error ? error.message : "Erreur d’initialisation Supabase.",
      ),
    };
  }

  return { status: "ready" };
}
