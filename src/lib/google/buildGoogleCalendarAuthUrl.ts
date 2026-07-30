import { getGoogleCalendarEnv } from "@/lib/google/calendarEnv";

/**
 * Construit l'URL OAuth2 Google Calendar (consent artisan).
 * Retourne null si les variables d'env ne sont pas configurées.
 */
export function buildGoogleCalendarAuthUrl(state: string): string | null {
  const env = getGoogleCalendarEnv();
  if (!env) return null;

  const params = new URLSearchParams({
    client_id: env.clientId,
    redirect_uri: env.redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: env.scopes.join(" "),
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
