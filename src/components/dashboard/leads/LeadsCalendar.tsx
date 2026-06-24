"use client";

import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import {
  addMonths,
  calendarRangeBounds,
  formatDurationLabel,
  formatScheduleDate,
  leadsForDate,
  monthGridDays,
  toDateKey,
  weekDays,
} from "@/lib/leads/schedule";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type CalendarView = "day" | "week" | "month";

type LeadsCalendarProps = {
  leads: DashboardLead[];
  copy: DashboardDictionary;
  locale: Locale;
  onOpenDetail: (leadId: string) => void;
};

export function LeadsCalendar({
  leads,
  copy,
  locale,
  onOpenDetail,
}: LeadsCalendarProps) {
  const c = copy.leads.calendar;
  const { min, max } = calendarRangeBounds();
  const [view, setView] = useState<CalendarView>("month");
  const [cursor, setCursor] = useState(() => new Date());

  const scheduledLeads = useMemo(
    () => leads.filter((lead) => lead.schedule?.date && lead.workflowStatus !== "archived"),
    [leads],
  );

  const monthLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const shift = (delta: number) => {
    if (view === "month") {
      setCursor((prev) => {
        const next = addMonths(prev, delta);
        const minMonth = new Date(min.getFullYear(), min.getMonth(), 1);
        const maxMonth = new Date(max.getFullYear(), max.getMonth(), 1);
        if (next < minMonth) return minMonth;
        if (next > maxMonth) return maxMonth;
        return next;
      });
      return;
    }

    setCursor((prev) => {
      const next = new Date(prev);
      if (view === "week") next.setDate(prev.getDate() + delta * 7);
      else next.setDate(prev.getDate() + delta);
      if (next < min) return new Date(min);
      if (next > max) return new Date(max);
      return next;
    });
  };

  const durationLabels = {
    ...copy.leads.schedule.durationPresets,
    minutesUnit: copy.leads.schedule.minutesUnit,
    hoursUnit: copy.leads.schedule.hoursUnit,
  };

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {(["day", "week", "month"] as CalendarView[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                view === mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              {c.views[mode]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="rounded-lg border border-neutral-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label={c.prev}
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[10rem] text-center text-sm font-semibold capitalize text-slate-800">
            {view === "day"
              ? formatScheduleDate(toDateKey(cursor), locale)
              : view === "week"
                ? c.weekOf.replace("{month}", monthLabel)
                : monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            className="rounded-lg border border-neutral-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label={c.next}
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {c.rangeHint.replace("{count}", String(scheduledLeads.length))}
      </p>

      {view === "month" ? (
        <MonthGrid
          cursor={cursor}
          leads={scheduledLeads}
          locale={locale}
          copy={copy}
          durationLabels={durationLabels}
          onOpenDetail={onOpenDetail}
        />
      ) : null}
      {view === "week" ? (
        <WeekGrid
          cursor={cursor}
          leads={scheduledLeads}
          locale={locale}
          copy={copy}
          durationLabels={durationLabels}
          onOpenDetail={onOpenDetail}
        />
      ) : null}
      {view === "day" ? (
        <DayList
          cursor={cursor}
          leads={scheduledLeads}
          locale={locale}
          copy={copy}
          durationLabels={durationLabels}
          onOpenDetail={onOpenDetail}
        />
      ) : null}
    </div>
  );
}

function MonthGrid({
  cursor,
  leads,
  locale,
  copy,
  durationLabels,
  onOpenDetail,
}: {
  cursor: Date;
  leads: DashboardLead[];
  locale: Locale;
  copy: DashboardDictionary;
  durationLabels: Parameters<typeof formatDurationLabel>[1];
  onOpenDetail: (id: string) => void;
}) {
  const c = copy.leads.calendar;
  const days = monthGridDays(cursor);
  const weekdayLabels = c.weekdays;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-px rounded-lg border border-neutral-200 bg-neutral-200 overflow-hidden">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="bg-slate-50 px-1 py-2 text-center text-[10px] font-bold uppercase text-slate-500"
          >
            {label}
          </div>
        ))}
        {days.map((day) => {
          const key = toDateKey(day);
          const inMonth = day.getMonth() === cursor.getMonth();
          const dayLeads = leadsForDate(leads, key);
          return (
            <div
              key={key}
              className={`min-h-[88px] bg-white p-1.5 ${inMonth ? "" : "bg-neutral-50/80"}`}
            >
              <p className={`text-[10px] font-semibold ${inMonth ? "text-slate-700" : "text-slate-300"}`}>
                {day.getDate()}
              </p>
              <ul className="mt-1 space-y-0.5">
                {dayLeads.slice(0, 2).map((lead) => (
                  <li key={lead.id}>
                    <button
                      type="button"
                      onClick={() => onOpenDetail(lead.id)}
                      className="block w-full truncate rounded bg-slate-100 px-1 py-0.5 text-left text-[9px] font-medium text-slate-700 hover:bg-slate-200"
                      title={lead.workType}
                    >
                      #{lead.requestNumber} {lead.clientName}
                    </button>
                  </li>
                ))}
                {dayLeads.length > 2 ? (
                  <li className="text-[9px] text-slate-400">+{dayLeads.length - 2}</li>
                ) : null}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  cursor,
  leads,
  locale,
  copy,
  durationLabels,
  onOpenDetail,
}: {
  cursor: Date;
  leads: DashboardLead[];
  locale: Locale;
  copy: DashboardDictionary;
  durationLabels: Parameters<typeof formatDurationLabel>[1];
  onOpenDetail: (id: string) => void;
}) {
  const days = weekDays(cursor);

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-7">
      {days.map((day) => {
        const key = toDateKey(day);
        const dayLeads = leadsForDate(leads, key);
        return (
          <div key={key} className="rounded-lg border border-neutral-200 bg-slate-50/50 p-2">
            <p className="text-xs font-bold text-slate-700">
              {formatScheduleDate(key, locale)}
            </p>
            <ul className="mt-2 space-y-1">
              {dayLeads.length === 0 ? (
                <li className="text-[10px] text-slate-400">—</li>
              ) : (
                dayLeads.map((lead) => (
                  <li key={lead.id}>
                    <button
                      type="button"
                      onClick={() => onOpenDetail(lead.id)}
                      className="w-full rounded-lg bg-white px-2 py-1.5 text-left text-[10px] shadow-sm hover:bg-slate-100"
                    >
                      <p className="font-semibold text-slate-800">{lead.clientName}</p>
                      <p className="truncate text-slate-500">{lead.workType}</p>
                      {lead.schedule ? (
                        <p className="text-slate-400">
                          {formatDurationLabel(lead.schedule, durationLabels)}
                        </p>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function DayList({
  cursor,
  leads,
  locale,
  copy,
  durationLabels,
  onOpenDetail,
}: {
  cursor: Date;
  leads: DashboardLead[];
  locale: Locale;
  copy: DashboardDictionary;
  durationLabels: Parameters<typeof formatDurationLabel>[1];
  onOpenDetail: (id: string) => void;
}) {
  const key = toDateKey(cursor);
  const dayLeads = leadsForDate(leads, key);
  const c = copy.leads.calendar;

  return (
    <div className="mt-4 space-y-2">
      {dayLeads.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">{c.emptyDay}</p>
      ) : (
        dayLeads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => onOpenDetail(lead.id)}
            className="flex w-full items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-slate-50/50 px-4 py-3 text-left hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">
                #{lead.requestNumber} · {lead.clientName}
              </p>
              <p className="truncate text-sm text-slate-600">{lead.workType}</p>
              <p className="text-xs text-slate-500">{lead.zone}</p>
            </div>
            {lead.schedule ? (
              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-neutral-200">
                {formatDurationLabel(lead.schedule, durationLabels)}
              </span>
            ) : null}
          </button>
        ))
      )}
    </div>
  );
}
