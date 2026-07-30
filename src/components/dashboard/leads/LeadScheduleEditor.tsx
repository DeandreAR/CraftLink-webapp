"use client";

import { useState } from "react";
import type { DashboardLead, LeadDurationPreset, LeadSchedule } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import { CalendarIcsButton } from "@/components/dashboard/leads/CalendarIcsButton";

type LeadScheduleEditorProps = {
  schedule: LeadSchedule | null | undefined;
  lead?: DashboardLead;
  onChange: (schedule: LeadSchedule | null) => void;
  copy: DashboardDictionary;
};

const PRESETS: LeadDurationPreset[] = ["minutes", "hours", "half_day", "full_day"];

export function LeadScheduleEditor({
  schedule,
  lead,
  onChange,
  copy,
}: LeadScheduleEditorProps) {
  const s = copy.leads.schedule;
  const [preset, setPreset] = useState<LeadDurationPreset>(
    schedule?.durationPreset ?? "hours",
  );
  const [durationValue, setDurationValue] = useState(
    String(schedule?.durationValue ?? (schedule?.durationPreset === "minutes" ? 60 : 2)),
  );
  const [date, setDate] = useState(schedule?.date ?? "");
  const [startTime, setStartTime] = useState(schedule?.startTime ?? "");
  const [endTime, setEndTime] = useState(schedule?.endTime ?? "");

  const apply = () => {
    if (!date) {
      onChange(null);
      return;
    }
    const value = Number(durationValue);
    onChange({
      date,
      durationPreset: preset,
      ...((preset === "minutes" || preset === "hours") && Number.isFinite(value)
        ? { durationValue: value }
        : {}),
      ...(startTime.trim() ? { startTime: startTime.trim() } : {}),
      ...(endTime.trim() ? { endTime: endTime.trim() } : {}),
    });
  };

  const clear = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    onChange(null);
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
      <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{s.hint}</p>

      <div className="mt-3 grid gap-3">
        <label className="block text-xs font-semibold text-slate-600">
          {s.dateLabel}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold text-slate-600">
            {s.startTimeLabel}
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            {s.endTimeLabel}
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </label>
        </div>
        <p className="text-[11px] leading-snug text-slate-500">{s.timeOptionalHint}</p>

        <label className="block text-xs font-semibold text-slate-600">
          {s.durationLabel}
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as LeadDurationPreset)}
            className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            {PRESETS.map((key) => (
              <option key={key} value={key}>
                {s.durationPresets[key]}
              </option>
            ))}
          </select>
        </label>

        {preset === "minutes" || preset === "hours" ? (
          <label className="block text-xs font-semibold text-slate-600">
            {preset === "minutes" ? s.minutesValueLabel : s.hoursValueLabel}
            <input
              type="number"
              min={1}
              value={durationValue}
              onChange={(e) => setDurationValue(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </label>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={apply}
          className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
        >
          {s.save}
        </button>
        {schedule ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-white"
          >
            {s.clear}
          </button>
        ) : null}
        {lead && (lead.schedule?.date || date) ? (
          <CalendarIcsButton
            lead={{
              ...lead,
              schedule: {
                date: lead.schedule?.date || date,
                durationPreset: lead.schedule?.durationPreset ?? preset,
                ...(lead.schedule?.durationValue != null
                  ? { durationValue: lead.schedule.durationValue }
                  : (preset === "minutes" || preset === "hours") &&
                      Number.isFinite(Number(durationValue))
                    ? { durationValue: Number(durationValue) }
                    : {}),
                ...(lead.schedule?.startTime || startTime.trim()
                  ? { startTime: lead.schedule?.startTime || startTime.trim() }
                  : {}),
                ...(lead.schedule?.endTime || endTime.trim()
                  ? { endTime: lead.schedule?.endTime || endTime.trim() }
                  : {}),
              },
            }}
            copy={copy}
            className="w-full px-4 py-2.5 text-sm sm:w-auto"
          />
        ) : null}
      </div>

      {schedule ? (
        <p className="mt-2 text-xs text-emerald-700">
          {s.savedHint
            .replace("{date}", schedule.date)
            .replace("{duration}", formatPreview(schedule, s))}
          {!schedule.startTime ? ` · ${s.allDayHint}` : null}
        </p>
      ) : null}
    </div>
  );
}

function formatPreview(
  schedule: LeadSchedule,
  s: DashboardDictionary["leads"]["schedule"],
): string {
  if (schedule.startTime) {
    const end = schedule.endTime ? `–${schedule.endTime}` : "";
    return `${schedule.startTime}${end}`;
  }
  if (schedule.durationPreset === "minutes") {
    return `${schedule.durationValue ?? 30} ${s.minutesUnit}`;
  }
  if (schedule.durationPreset === "hours") {
    return `${schedule.durationValue ?? 1} ${s.hoursUnit}`;
  }
  return s.durationPresets[schedule.durationPreset];
}
