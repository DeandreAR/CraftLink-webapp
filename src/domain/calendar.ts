/** Événement d'intervention à synchroniser vers un calendrier externe. */
export type CalendarEventDTO = {
  title: string;
  description: string;
  location: string;
  /** ISO date (YYYY-MM-DD) ou datetime ISO. */
  startDate: string;
  /** ISO date/datetime de fin (optionnel si all-day d'un jour). */
  endDate?: string;
  isAllDay: boolean;
};

export type CalendarCreateResult =
  | { ok: true; provider: "ics" | "google"; icsContent?: string; eventId?: string }
  | { ok: false; message: string };

/** Contrat d'écriture d'événements calendrier (DIP). */
export interface ICalendarService {
  createEvent(event: CalendarEventDTO): Promise<CalendarCreateResult>;
}
