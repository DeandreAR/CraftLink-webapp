import type { Locale } from "@/i18n/config";
import { formatConfigDebugMessage, logAuthError, AUTH_SERVICE_UNAVAILABLE } from "@/lib/auth/debugError";
import { rethrowIfNextNavigationError } from "@/lib/next/navigationErrors";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isMissingAuthSessionError } from "@/lib/supabase/authErrors";

export type PreparePasswordResetPageResult =
  | { status: "unavailable"; message: string }
  | { status: "no_session" }
  | { status: "ready" };

/** Page nouveau mot de passe : session recovery requise (lien e-mail). */
export async function preparePasswordResetPage(
  _lang: Locale,
): Promise<PreparePasswordResetPageResult> {
  if (!getSupabaseConfig()) {
    return {
      status: "unavailable",
      message: formatConfigDebugMessage(
        "supabase.config",
        AUTH_SERVICE_UNAVAILABLE,
        "Configuration Supabase manquante ou placeholder",
      ),
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return { status: "ready" };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (isMissingAuthSessionError(error)) {
        return { status: "no_session" };
      }
      logAuthError("preparePasswordResetPage.getUser", error);
      return { status: "no_session" };
    }

    if (!user) {
      return { status: "no_session" };
    }

    return { status: "ready" };
  } catch (error) {
    rethrowIfNextNavigationError(error);
    logAuthError("preparePasswordResetPage", error);
    return {
      status: "unavailable",
      message: formatConfigDebugMessage(
        "supabase.preparePasswordResetPage",
        AUTH_SERVICE_UNAVAILABLE,
        error instanceof Error ? error.message : error,
      ),
    };
  }
}
