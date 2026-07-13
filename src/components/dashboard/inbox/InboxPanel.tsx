"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { LeadInboxDetail } from "@/components/dashboard/inbox/LeadInboxDetail";
import { LeadInboxList } from "@/components/dashboard/inbox/LeadInboxList";
import type { Profile } from "@/domain/profile";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { useLeadsWorkspace } from "@/lib/dashboard/useLeadsWorkspace";

type InboxPanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
};

export function InboxPanel({
  profile,
  copy,
  locale,
  initialLeads,
  initialLoadError,
}: InboxPanelProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const workspace = useLeadsWorkspace({
    profile,
    copy,
    initialLeads,
    initialLoadError,
  });

  const { newLeads, dashboardUser, loadError, validateAndPlanLead, archiveLead, handlers } =
    workspace;

  const selectedLead = useMemo(
    () => newLeads.find((lead) => lead.id === selectedLeadId) ?? null,
    [newLeads, selectedLeadId],
  );

  useEffect(() => {
    if (selectedLeadId && !newLeads.some((lead) => lead.id === selectedLeadId)) {
      setSelectedLeadId(newLeads[0]?.id ?? null);
    } else if (!selectedLeadId && newLeads[0]) {
      setSelectedLeadId(newLeads[0].id);
    }
  }, [newLeads, selectedLeadId]);

  const showMobileDetail = Boolean(selectedLeadId);
  const inbox = copy.inbox;

  const handleValidate = (leadId: string, schedule: DashboardLead["schedule"]) => {
    validateAndPlanLead(leadId, schedule ?? null);
    setSelectedLeadId(null);
  };

  const handleArchive = (leadId: string) => {
    archiveLead(leadId);
    setSelectedLeadId(null);
  };

  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <DashboardPageHeader title={inbox.title} subtitle={inbox.subtitle} />

      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {loadError}
        </div>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div
          className={`min-w-0 lg:w-[35%] lg:shrink-0 ${
            showMobileDetail ? "hidden lg:block" : "block"
          }`}
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#5b6478]">
            {inbox.listHeading}
          </p>
          <LeadInboxList
            leads={newLeads}
            selectedId={selectedLeadId}
            copy={copy}
            onSelect={setSelectedLeadId}
          />
        </div>

        <div
          className={`min-w-0 flex-1 lg:w-[65%] ${
            showMobileDetail ? "block" : "hidden lg:block"
          }`}
        >
          {selectedLead ? (
            <LeadInboxDetail
              key={selectedLead.id}
              lead={selectedLead}
              plan={dashboardUser.plan}
              copy={copy}
              locale={locale}
              onBack={() => setSelectedLeadId(null)}
              onValidateAndPlan={handleValidate}
              onArchive={handleArchive}
              onDelayStatusChange={(status) =>
                handlers.onDelayStatusChange(selectedLead.id, status)
              }
              onScheduleChange={(schedule) =>
                handlers.onScheduleChange(selectedLead.id, schedule)
              }
            />
          ) : (
            <div className="flex min-h-[20rem] items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#EFA188]/35 bg-white/70 p-8 text-center">
              <p className="max-w-xs text-sm font-medium text-[#5b6478]">
                {inbox.selectLead}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
