import type { CalendarCreateResult, CalendarEventDTO, ICalendarService } from "@/domain/calendar";
import { buildIcsCalendar } from "@/lib/calendar/buildIcsCalendar";

/** Fallback universel : génère un fichier .ics (Apple / Outlook / Google import). */
export class IcsCalendarProvider implements ICalendarService {
  async createEvent(event: CalendarEventDTO): Promise<CalendarCreateResult> {
    const uid = `craftlink-${crypto.randomUUID()}@getcraftlink.com`;
    const icsContent = buildIcsCalendar([{ ...event, uid }]);
    return { ok: true, provider: "ics", icsContent };
  }
}
