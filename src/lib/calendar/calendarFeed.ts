import { buildAppUrl } from "@/config/app";
import { mapLeadToCalendarEvent } from "@/lib/calendar/mapLeadToCalendarEvent";
import { buildIcsCalendar } from "@/lib/calendar/buildIcsCalendar";
import type { DashboardLead } from "@/domain/lead";

/** Construit le flux ICS de toutes les interventions planifiées d'un artisan. */
export function buildLeadsIcsFeed(leads: DashboardLead[], calendarName?: string): string {
  const events = leads
    .map((lead) => {
      const event = mapLeadToCalendarEvent(lead);
      if (!event) return null;
      return {
        ...event,
        uid: `craftlink-lead-${lead.id}@getcraftlink.com`,
      };
    })
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return buildIcsCalendar(events, calendarName ?? "CraftLink Interventions");
}

export function buildCalendarFeedUrls(token: string): {
  httpsUrl: string;
  webcalUrl: string;
  googleSubscribeUrl: string;
} {
  const httpsUrl = buildAppUrl(`/api/calendar/feed/${token}`);
  const webcalUrl = httpsUrl.replace(/^https:/i, "webcal:").replace(/^http:/i, "webcal:");
  const googleSubscribeUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
  return { httpsUrl, webcalUrl, googleSubscribeUrl };
}
