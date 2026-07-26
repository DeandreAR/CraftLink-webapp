"use client";

import { FaDownload } from "react-icons/fa6";
import type { DashboardLead, LeadWorkflowStatus } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { downloadLeadsCsv } from "@/lib/dashboard/export/exportLeadsToCsv";

type DashboardExportCsvButtonProps = {
  leads: DashboardLead[];
  copy: DashboardDictionary;
  locale: Locale;
};

export function DashboardExportCsvButton({ leads, copy, locale }: DashboardExportCsvButtonProps) {
  const e = copy.export;

  const handleExport = () => {
    downloadLeadsCsv(
      leads,
      e.columns,
      copy.leads.workflow.labels as Record<LeadWorkflowStatus, string>,
      locale,
    );
  };

  return (
    <button
      type="button"
      aria-label={e.ariaLabel}
      disabled={leads.length === 0}
      onClick={handleExport}
      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 sm:text-[11px] md:px-4 md:py-2 md:text-xs"
    >
      <FaDownload className="h-3.5 w-3.5 shrink-0 text-[#EFA188]" aria-hidden />
      <span className="truncate">{e.button}</span>
    </button>
  );
}
