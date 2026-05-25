import { redirect } from "next/navigation";
import { authPath } from "@/lib/auth/paths";
import {
  resolveWorkspaceSession,
  type WorkspaceSession,
} from "@/lib/auth/sessionContext";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/config";

/** Redirige vers la connexion si pas de session + profil. */
export async function requireSessionProfile(
  lang: Locale,
): Promise<WorkspaceSession> {
  const supabase = await createClient();
  const session = await resolveWorkspaceSession(supabase);

  if (!session.ok) {
    redirect(authPath(lang, "login"));
  }

  if (!session.data) {
    redirect(authPath(lang, "login"));
  }

  return session.data;
}
