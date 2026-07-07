import { getAppUrl } from "@/config/app";

/** URL de retour après clic sur le lien de confirmation Supabase (à autoriser dans le dashboard). */
export function buildAuthCallbackUrl(nextPath: string, appUrl?: string): string {
  const base = normalizeOrigin(appUrl ?? getAppUrl());
  const url = new URL(`${base}/auth/callback`);
  url.searchParams.set("next", nextPath);
  return url.toString();
}

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, "");
}
