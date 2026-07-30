"use client";

import type { DashboardLead } from "@/domain/lead";
import { addInterventionToCalendar } from "@/services/calendar/addInterventionToCalendar";

/** Télécharge un .ics pour le lead planifié (Apple / Outlook / Google). */
export async function downloadLeadCalendarIcs(lead: DashboardLead): Promise<
  { ok: true } | { ok: false; message: string }
> {
  const result = await addInterventionToCalendar({ lead });
  if (!result.ok || !result.icsContent) {
    return { ok: false, message: result.ok ? "Fichier ICS vide." : result.message };
  }

  const blob = new Blob([result.icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `craftlink-intervention-${lead.requestNumber || lead.id.slice(0, 8)}.ics`;
  a.click();
  URL.revokeObjectURL(url);
  return { ok: true };
}
