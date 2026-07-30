import type { CalendarCreateResult, ICalendarService } from "@/domain/calendar";
import type { DashboardLead } from "@/domain/lead";
import { mapLeadToCalendarEvent } from "@/lib/calendar/mapLeadToCalendarEvent";
import { IcsCalendarProvider } from "@/services/calendar/icsCalendarProvider";

type AddInterventionToCalendarInput = {
  lead: DashboardLead;
  /** Provider injecté (tests / Google). Défaut : ICS. */
  calendarService?: ICalendarService;
};

/**
 * Use case : crée un événement d'intervention dans le calendrier choisi.
 * Par défaut génère un .ics (fallback universel, zéro OAuth).
 */
export async function addInterventionToCalendar({
  lead,
  calendarService = new IcsCalendarProvider(),
}: AddInterventionToCalendarInput): Promise<CalendarCreateResult> {
  const event = mapLeadToCalendarEvent(lead);
  if (!event) {
    return { ok: false, message: "Aucune date de planification sur ce dossier." };
  }
  return calendarService.createEvent(event);
}
