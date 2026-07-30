"use client";

import { useState, type MouseEvent } from "react";
import { FaCalendarPlus } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { downloadLeadCalendarIcs } from "@/lib/calendar/downloadLeadCalendarIcs";
import type { DashboardDictionary } from "@/i18n/types";

type CalendarIcsButtonProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
  className?: string;
};

export function CalendarIcsButton({ lead, copy, className = "" }: CalendarIcsButtonProps) {
  const s = copy.leads.schedule;
  const [busy, setBusy] = useState(false);

  if (!lead.schedule?.date) return null;

  const onClick = async (e: MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    await downloadLeadCalendarIcs(lead);
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={(e) => void onClick(e)}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#efa188] bg-[#efa188]/15 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-[#efa188]/30 disabled:opacity-60 ${className}`.trim()}
    >
      <FaCalendarPlus className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {busy ? s.addToCalendarBusy : s.addToCalendar}
    </button>
  );
}
