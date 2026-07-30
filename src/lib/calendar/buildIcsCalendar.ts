import type { CalendarEventDTO } from "@/domain/calendar";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIcsStamp(iso: string, allDay: boolean): string {
  if (allDay) return iso.slice(0, 10).replace(/-/g, "");
  const d = new Date(iso);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function nextAllDayEnd(startDay: string): string {
  const d = new Date(`${startDay}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function eventToVEvent(event: CalendarEventDTO, uid: string, stamp: string): string {
  const dtStart = toIcsStamp(event.startDate, event.isAllDay);
  const endRaw =
    event.endDate ??
    (event.isAllDay ? nextAllDayEnd(event.startDate.slice(0, 10)) : event.startDate);
  const dtEnd = toIcsStamp(endRaw, event.isAllDay);
  const dateProp = event.isAllDay ? ";VALUE=DATE" : "";

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART${dateProp}:${dtStart}`,
    `DTEND${dateProp}:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "END:VEVENT",
  ].join("\r\n");
}

/** Construit un calendrier ICS multi-événements (abonnement agenda). */
export function buildIcsCalendar(
  events: Array<CalendarEventDTO & { uid: string }>,
  calendarName = "CraftLink Interventions",
): string {
  const stamp = toIcsStamp(new Date().toISOString(), false);
  const vevents = events.map((event) => eventToVEvent(event, event.uid, stamp));

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CraftLink//Intervention//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    ...vevents,
    "END:VCALENDAR",
  ].join("\r\n");
}
