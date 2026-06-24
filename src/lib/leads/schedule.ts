import type { DashboardLead, LeadDurationPreset, LeadSchedule } from "@/domain/lead";
import type { Locale } from "@/i18n/config";

export function parseScheduleDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatScheduleDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseScheduleDate(date));
}

export function formatDurationLabel(
  schedule: LeadSchedule,
  labels: Record<LeadDurationPreset, string> & { minutesUnit: string; hoursUnit: string },
): string {
  if (schedule.durationPreset === "minutes") {
    return `${schedule.durationValue ?? 30} ${labels.minutesUnit}`;
  }
  if (schedule.durationPreset === "hours") {
    return `${schedule.durationValue ?? 1} ${labels.hoursUnit}`;
  }
  return labels[schedule.durationPreset];
}

export function leadsForDate(leads: DashboardLead[], date: string): DashboardLead[] {
  return leads.filter(
    (lead) => lead.schedule?.date === date && lead.workflowStatus !== "archived",
  );
}

export function calendarRangeBounds(): { min: Date; max: Date } {
  const now = new Date();
  return {
    min: new Date(now.getFullYear() - 1, now.getMonth(), 1),
    max: new Date(now.getFullYear() + 1, 11, 31),
  };
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function clampMonthCursor(cursor: Date, min: Date, max: Date): Date {
  if (cursor < min) return new Date(min);
  if (cursor > max) return new Date(max.getFullYear(), max.getMonth(), 1);
  return cursor;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date: Date): Date {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function monthGridDays(cursor: Date): Date[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
