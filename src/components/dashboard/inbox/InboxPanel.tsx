"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardExportCsvButton } from "@/components/dashboard/DashboardExportCsvButton";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { LeadInboxDetail } from "@/components/dashboard/inbox/LeadInboxDetail";
import { LeadInboxList } from "@/components/dashboard/inbox/LeadInboxList";
import type { Profile } from "@/domain/profile";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { useLeadsWorkspace } from "@/lib/dashboard/useLeadsWorkspace";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type InboxPanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
  initialSelectedLeadId?: string | null;
};

export function InboxPanel({
  profile,
  copy,
  locale,
  initialLeads,
  initialLoadError,
  initialSelectedLeadId = null,
}: InboxPanelProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(
    initialSelectedLeadId,
  );
  const isWideInbox = useMediaQuery("(min-width: 1024px)");
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
    if (initialSelectedLeadId) {
      setSelectedLeadId(initialSelectedLeadId);
    }
  }, [initialSelectedLeadId]);

  useEffect(() => {
    if (selectedLeadId && !newLeads.some((lead) => lead.id === selectedLeadId)) {
      setSelectedLeadId(isWideInbox ? (newLeads[0]?.id ?? null) : null);
    } else if (!selectedLeadId && newLeads[0] && isWideInbox) {
      setSelectedLeadId(newLeads[0].id);
    }
  }, [newLeads, selectedLeadId, isWideInbox]);

  const showCompactDetail = Boolean(selectedLeadId) && !isWideInbox;

  useEffect(() => {
    if (!showCompactDetail) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCompactDetail]);

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
    <section className="db-inbox-split flex flex-col gap-4 lg:gap-8">
      <DashboardPageHeader
        title={inbox.title}
        subtitle={inbox.subtitle}
        compactOnMobile
        actions={
          <DashboardExportCsvButton leads={newLeads} copy={copy} locale={locale} />
        }
      />

      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {loadError}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div
          className={`min-w-0 lg:w-[35%] lg:shrink-0 ${
            showCompactDetail ? "hidden lg:block" : "block"
          }`}
        >
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#5b6478] lg:mb-3">
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
            showCompactDetail ? "block" : "hidden lg:block"
          }`}
        >
          {selectedLead ? (
            <LeadInboxDetail
              key={selectedLead.id}
              lead={selectedLead}
              plan={dashboardUser.plan}
              copy={copy}
              locale={locale}
              compact={!isWideInbox}
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
            <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center lg:min-h-[20rem] lg:p-8">
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
