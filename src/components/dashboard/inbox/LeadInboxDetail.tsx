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

  return (
    <article className="flex h-full min-h-[20rem] flex-col overflow-hidden rounded-[1.5rem] border-2 border-[#212129]/8 bg-white shadow-xl">
      <header className="border-b border-[#EFA188]/20 bg-gradient-to-r from-[#FFF5F0] to-white px-6 py-5 md:px-8">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-[#5b6478] transition hover:text-[#212129] lg:hidden"
          >
            <FaArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {inbox.backToList}
          </button>
        ) : null}
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#EFA188]">
          #{formatRequestNumber(lead.requestNumber)} · {inbox.statusNew}
        </p>
        <h2 className="lk-display mt-1 text-2xl md:text-[1.65rem]">{lead.clientName}</h2>
        <p className="mt-1 text-base font-bold text-[#212129]">{lead.workType}</p>
        {lead.needNature?.trim() ? (
          <p className="mt-2 text-sm font-semibold text-[#c45a3a]">{lead.needNature}</p>
        ) : null}
      </header>

      <div className="scrollbar-soft flex-1 space-y-4 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
        <section className="rounded-2xl border border-[#212129]/8 bg-[#FDFBF7] p-4 md:p-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5b6478]">
            {w.sectionClient}
          </h3>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-[#5b6478]">
                {l.columns.requestDate}
              </dt>
              <dd className="mt-1 font-semibold text-[#212129]">
                {formatLeadDate(lead.createdAt, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-[#5b6478]">
                {l.columns.zone}
              </dt>
              <dd className="mt-1 font-medium text-[#212129]">{lead.zone}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-[#5b6478]">
                {d.phoneLabel}
              </dt>
              <dd className="mt-1 font-semibold text-[#212129]">
                {lead.clientPhone ? formatClientPhone(lead.clientPhone, locale) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-[#5b6478]">
                {l.columns.delay}
              </dt>
              <dd className="mt-1">
                <LeadStatusPicker
                  value={lead.delayStatus}
                  onChange={onDelayStatusChange}
                  copy={copy}
                />
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[#212129]/8 bg-white p-4 md:p-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5b6478]">
            {w.sectionWork}
          </h3>
          <div className="mt-4">
            <LeadCopyRequestButton lead={lead} copy={copy} locale={locale} />
            <div className="mt-4">
              <LeadDetailMedia lead={lead} plan={plan} copy={copy} embedded />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#212129]/8 bg-[#FDFBF7] p-4 md:p-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5b6478]">
            {w.sectionPlanning}
          </h3>
          <p className="mt-1 text-xs text-[#5b6478]">{inbox.planHint}</p>
          <div className="mt-3">
            <LeadScheduleEditor
              schedule={schedule}
              onChange={handleScheduleChange}
              copy={copy}
            />
          </div>
        </section>
      </div>

      <footer className="flex flex-col gap-2 border-t border-[#EFA188]/20 bg-white px-6 py-4 md:flex-row md:px-8">
        <GlowButton
          type="button"
          disabled={busy}
          className="w-full flex-1 justify-center py-3.5"
          onClick={handleValidate}
        >
          {inbox.validateAndPlan}
        </GlowButton>
        <LandingCta
          type="button"
          variant="secondary"
          disabled={busy}
          className="w-full flex-1 justify-center md:max-w-[12rem]"
          onClick={handleArchive}
        >
          {inbox.archive}
        </LandingCta>
      </footer>
    </article>
  );
}
