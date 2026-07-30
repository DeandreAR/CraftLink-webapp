import "server-only";

export type GoogleCalendarEnv = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
};

/** Secrets OAuth Google Calendar (serveur uniquement). */
export function getGoogleCalendarEnv(): GoogleCalendarEnv | null {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret || !redirectUri) return null;

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  };
}
