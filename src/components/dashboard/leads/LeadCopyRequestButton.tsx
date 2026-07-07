"use client";

import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { formatLeadCopyText } from "@/lib/leads/formatLeadCopyText";
import type { Locale } from "@/i18n/config";
import type { DashboardDictionary } from "@/i18n/types";

type LeadCopyRequestButtonProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
  locale: Locale;
};

export function LeadCopyRequestButton({ lead, copy, locale }: LeadCopyRequestButtonProps) {
  const c = copy.leads.copyRequest;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = formatLeadCopyText(lead, locale);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-neutral-50 sm:w-auto"
    >
      {copied ? (
        <FaCheck className="h-4 w-4 text-emerald-600" aria-hidden />
      ) : (
        <FaCopy className="h-4 w-4 text-neutral-500" aria-hidden />
      )}
      {copied ? c.copied : c.label}
    </button>
  );
}
