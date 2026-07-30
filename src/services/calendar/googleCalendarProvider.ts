import "server-only";

import type { CalendarCreateResult, CalendarEventDTO, ICalendarService } from "@/domain/calendar";

type GoogleCalendarProviderOptions = {
  /** Access token OAuth2 artisan (Calendar scope). */
  accessToken: string;
  /** calendarId Google — défaut calendrier principal. */
  calendarId?: string;
};

/**
 * Google Calendar API v3 via OAuth2 (token artisan).
 * Service Account : passer un access token obtenu via JWT (google-auth) côté appelant.
 */
export class GoogleCalendarProvider implements ICalendarService {
  private readonly accessToken: string;
  private readonly calendarId: string;

  constructor(options: GoogleCalendarProviderOptions) {
    this.accessToken = options.accessToken;
    this.calendarId = encodeURIComponent(options.calendarId ?? "primary");
  }

  async createEvent(event: CalendarEventDTO): Promise<CalendarCreateResult> {
    if (!this.accessToken.trim()) {
      return { ok: false, message: "Token Google Calendar manquant." };
    }

    const body = event.isAllDay
      ? {
          summary: event.title,
          description: event.description,
          location: event.location,
          start: { date: event.startDate.slice(0, 10) },
          end: {
            date: (event.endDate ?? nextDay(event.startDate)).slice(0, 10),
          },
        }
      : {
          summary: event.title,
          description: event.description,
          location: event.location,
          start: { dateTime: toRfc3339(event.startDate) },
          end: { dateTime: toRfc3339(event.endDate ?? event.startDate) },
        };

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        message: `Google Calendar error ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`,
      };
    }

    const json = (await res.json()) as { id?: string };
    return { ok: true, provider: "google", eventId: json.id };
  }
}

function nextDay(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function toRfc3339(iso: string): string {
  if (iso.includes("T")) return new Date(iso).toISOString();
  return new Date(`${iso}T09:00:00`).toISOString();
}
