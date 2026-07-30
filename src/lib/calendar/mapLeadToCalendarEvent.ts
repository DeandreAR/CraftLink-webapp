import type { CalendarEventDTO } from "@/domain/calendar";
import type { DashboardLead, LeadSchedule } from "@/domain/lead";
import { buildLeadShareUrl } from "@/lib/leads/buildLeadShareUrl";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidClockTime(value: string | undefined): value is string {
  return Boolean(value && TIME_RE.test(value));
}

/** Mappe un lead planifié vers un CalendarEventDTO (isAllDay si pas d'horaire). */
export function mapLeadToCalendarEvent(lead: DashboardLead): CalendarEventDTO | null {
  const schedule = lead.schedule;
  if (!schedule?.date) return null;

  const workLabel = lead.workType?.trim() || lead.needNature?.trim() || "Intervention";
  const dossierUrl = buildLeadShareUrl(lead.id);
  const { startDate, endDate, isAllDay } = resolveScheduleBounds(schedule);

  return {
    title: `Intervention - ${workLabel}`,
    description: [
      `Client: ${lead.clientName}`,
      `Téléphone: ${lead.clientPhone}`,
      `Lien dossier: ${dossierUrl}`,
    ].join("\n"),
    location: lead.zone?.trim() || "",
    startDate,
    endDate,
    isAllDay,
  };
}

export function resolveScheduleBounds(schedule: LeadSchedule): {
  startDate: string;
  endDate: string;
  isAllDay: boolean;
} {
  const day = schedule.date;
  const hasStart = isValidClockTime(schedule.startTime);
  const hasEnd = isValidClockTime(schedule.endTime);

  if (!hasStart) {
    const end = addDays(day, schedule.durationPreset === "full_day" ? 1 : 1);
    return { startDate: day, endDate: end, isAllDay: true };
  }

  const startDate = `${day}T${schedule.startTime}:00`;
  if (hasEnd) {
    return {
      startDate,
      endDate: `${day}T${schedule.endTime}:00`,
      isAllDay: false,
    };
  }

  const endDate = addDuration(startDate, schedule);
  return { startDate, endDate, isAllDay: false };
}

function addDays(day: string, days: number): string {
  const d = new Date(`${day}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function addDuration(startIso: string, schedule: LeadSchedule): string {
  const d = new Date(startIso);
  if (schedule.durationPreset === "minutes") {
    d.setMinutes(d.getMinutes() + (schedule.durationValue ?? 60));
  } else if (schedule.durationPreset === "hours") {
    d.setHours(d.getHours() + (schedule.durationValue ?? 2));
  } else if (schedule.durationPreset === "half_day") {
    d.setHours(d.getHours() + 4);
  } else {
    d.setHours(d.getHours() + 8);
  }
  return d.toISOString();
}
