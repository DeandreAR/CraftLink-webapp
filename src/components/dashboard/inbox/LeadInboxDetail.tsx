"use client";

import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardLead } from "@/domain/lead";
import type { LeadSchedule } from "@/domain/lead";
import { LeadCopyRequestButton } from "@/components/dashboard/leads/LeadCopyRequestButton";
import { LeadDetailMedia } from "@/components/dashboard/leads/LeadDetailMedia";
import { LeadScheduleEditor } from "@/components/dashboard/leads/LeadScheduleEditor";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { GlowButton } from "@/components/ui/GlowButton";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  formatClientPhone,
  formatLeadDate,
  formatRequestNumber,
} from "@/components/dashboard/leads/leadsViewShared";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type LeadInboxDetailProps = {
  lead: DashboardLead;
  plan: CraftlinkPlan;
  copy: DashboardDictionary;
  locale: Locale;
  compact?: boolean;
  onBack?: () => void;
  onValidateAndPlan: (leadId: string, schedule: LeadSchedule | null) => void;
  onArchive: (leadId: string) => void;
  onDelayStatusChange: (status: DashboardLead["delayStatus"]) => void;
  onScheduleChange: (schedule: LeadSchedule | null) => void;
};

export function LeadInboxDetail({
  lead,
  plan,
  copy,
  locale,
  compact = false,
  onBack,
  onValidateAndPlan,
  onArchive,
  onDelayStatusChange,
  onScheduleChange,
}: LeadInboxDetailProps) {
  const d = copy.leads.detail;
  const l = copy.leads;
  const w = copy.leads.workflow;
  const inbox = copy.inbox;
  const [schedule, setSchedule] = useState<LeadSchedule | null>(lead.schedule ?? null);
  const [busy, setBusy] = useState(false);

  const handleValidate = () => {
    setBusy(true);
    onValidateAndPlan(lead.id, schedule);
    setBusy(false);
  };

  const handleArchive = () => {
    setBusy(true);
    onArchive(lead.id);
    setBusy(false);
  };

  const handleScheduleChange = (next: LeadSchedule | null) => {
    setSchedule(next);
    onScheduleChange(next);
  };

  const sectionClass = `rounded-2xl border border-[#212129]/8 bg-[#FDFBF7] p-3 lg:p-5 ${
    compact ? "db-inbox-section" : ""
  }`;

  return (
    <article
      className={`flex h-full min-h-[20rem] flex-col overflow-hidden rounded-[1.5rem] border-2 border-[#212129]/8 bg-white shadow-xl ${
        compact ? "db-inbox-detail-sheet" : ""
      }`}
    >
      <header className="border-b border-[#EFA188]/20 bg-gradient-to-r from-[#FFF5F0] to-white px-4 py-3 lg:px-8 lg:py-5">
        {onBack && compact ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-[#5b6478] transition hover:text-[#212129]"
          >
            <FaArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {inbox.backToList}
          </button>
        ) : null}
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#EFA188]">
          #{formatRequestNumber(lead.requestNumber)} · {inbox.statusNew}
        </p>
        <h2 className="lk-display mt-0.5 text-lg lg:mt-1 lg:text-[1.65rem]">{lead.clientName}</h2>
        <p className="mt-0.5 text-sm font-bold text-[#212129] lg:mt-1 lg:text-base">{lead.workType}</p>
        {lead.needNature?.trim() ? (
          <p className="mt-1 text-xs font-semibold text-[#c45a3a] lg:mt-2 lg:text-sm">{lead.needNature}</p>
        ) : null}
      </header>

      <div
        className={`scrollbar-soft flex-1 space-y-3 overflow-y-auto px-4 py-3 lg:space-y-4 lg:px-8 lg:py-6 ${
          compact ? "db-inbox-detail-body" : ""
        }`}
      >
        <section className={sectionClass}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5b6478] lg:text-[11px]">
            {w.sectionClient}
          </h3>
          <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2 lg:mt-4 lg:gap-4">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478] lg:text-xs">
                {l.columns.requestDate}
              </dt>
              <dd className="mt-0.5 font-semibold text-[#212129] lg:mt-1">
                {formatLeadDate(lead.createdAt, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478] lg:text-xs">
                {l.columns.zone}
              </dt>
              <dd className="mt-0.5 font-medium text-[#212129] lg:mt-1">{lead.zone}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478] lg:text-xs">
                {d.phoneLabel}
              </dt>
              <dd className="mt-0.5 font-semibold text-[#212129] lg:mt-1">
                {lead.clientPhone ? formatClientPhone(lead.clientPhone, locale) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478] lg:text-xs">
                {l.columns.delay}
              </dt>
              <dd className="mt-0.5 lg:mt-1">
                <LeadStatusPicker
                  value={lead.delayStatus}
                  onChange={onDelayStatusChange}
                  copy={copy}
                />
              </dd>
            </div>
          </dl>
        </section>

        <section className={`${sectionClass} bg-white`}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5b6478] lg:text-[11px]">
            {w.sectionWork}
          </h3>
          <div className="mt-2 lg:mt-4">
            <LeadCopyRequestButton lead={lead} copy={copy} locale={locale} />
            <div className="mt-2 lg:mt-4">
              <LeadDetailMedia lead={lead} plan={plan} copy={copy} embedded />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5b6478] lg:text-[11px]">
            {w.sectionPlanning}
          </h3>
          <p className="mt-0.5 text-[10px] text-[#5b6478] lg:mt-1 lg:text-xs">{inbox.planHint}</p>
          <div className="mt-2 lg:mt-3">
            <LeadScheduleEditor
              schedule={schedule}
              onChange={handleScheduleChange}
              copy={copy}
            />
          </div>
        </section>
      </div>

      <footer className="flex flex-col gap-2 border-t border-[#EFA188]/20 bg-white px-4 py-3 lg:flex-row lg:px-8 lg:py-4">
        <GlowButton
          type="button"
          disabled={busy}
          className="w-full flex-1 justify-center py-2.5 lg:py-3.5"
          onClick={handleValidate}
        >
          {inbox.validateAndPlan}
        </GlowButton>
        <LandingCta
          type="button"
          variant="secondary"
          disabled={busy}
          className="w-full flex-1 justify-center py-2.5 lg:max-w-[12rem] lg:py-3.5"
          onClick={handleArchive}
        >
          {inbox.archive}
        </LandingCta>
      </footer>
    </article>
  );
}
