"use client";

import { useCallback, useMemo, useState } from "react";
import { FaCalendarDays, FaChartPie, FaGrip, FaList, FaTableColumns } from "react-icons/fa6";
import { DashboardExportCsvButton } from "@/components/dashboard/DashboardExportCsvButton";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardViewTabs } from "@/components/dashboard/DashboardViewTabs";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import { LeadDetailPanel } from "@/components/dashboard/leads/LeadDetailPanel";
import { LeadsBulkActionsBar } from "@/components/dashboard/leads/LeadsBulkActionsBar";
import { LeadsCalendar } from "@/components/dashboard/leads/LeadsCalendar";
import { LeadsCardsToolbar } from "@/components/dashboard/leads/LeadsCardsToolbar";
import { LeadsPipelineView } from "@/components/dashboard/leads/LeadsPipelineView";
import { LeadsSummaryCards } from "@/components/dashboard/leads/LeadsSummaryCards";
import { LeadsTableView } from "@/components/dashboard/leads/LeadsTableView";
import { LeadsTableToolbar } from "@/components/dashboard/leads/LeadsTableToolbar";
import { ProFeatureGuard } from "@/components/dashboard/ProFeatureGuard";
import { SmartCatchUpBanner } from "@/components/dashboard/leads/SmartCatchUpBanner";
import { WhatsAppUpgradeModal } from "@/components/dashboard/leads/WhatsAppUpgradeModal";
import { LeadsStatisticsPanel } from "@/components/dashboard/stats/LeadsStatisticsPanel";
import type { LeadsViewHandlers } from "@/components/dashboard/leads/leadsViewTypes";
import type { Profile } from "@/domain/profile";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { useLeadsWorkspace } from "@/lib/dashboard/useLeadsWorkspace";
import {
  DEFAULT_LEAD_TABLE_FILTER,
  filterLeads,
  type LeadTableFilter,
} from "@/lib/leads/filterLeads";
import { DEFAULT_LEAD_SORT, sortLeads, type LeadSortState } from "@/lib/leads/sortLeads";

export type OrganizeDisplayView = "table" | "cards" | "pipeline";
export type OrganizeSectionView = "list" | "calendar" | "stats";

type OrganizationPanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
};

export function OrganizationPanel({
  profile,
  copy,
  locale,
  initialLeads,
  initialLoadError,
}: OrganizationPanelProps) {
  const o = copy.organize;
  const workspace = useLeadsWorkspace({
    profile,
    copy,
    initialLeads,
    initialLoadError,
  });

  const {
    organizedLeads,
    sortedOrganizedLeads,
    dashboardUser,
    upgradeOpen,
    setUpgradeOpen,
    whatsappError,
    setWhatsappError,
    loadError,
    catchUpLead,
    catchUpBusy,
    catchUpError,
    setCatchUpError,
    summaryStats,
    quotaLabel,
    handlers: baseHandlers,
    replaceLead,
    handleCatchUp,
    businessName,
  } = workspace;

  const [section, setSection] = useState<OrganizeSectionView>("list");
  const [view, setView] = useState<OrganizeDisplayView>("table");
  const [sort, setSort] = useState<LeadSortState>(DEFAULT_LEAD_SORT);
  const [tableFilter, setTableFilter] = useState<LeadTableFilter>(DEFAULT_LEAD_TABLE_FILTER);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allOrganized = useMemo(() => {
    const pool = showArchived
      ? workspace.leads.filter((l) => l.workflowStatus !== "A_TRAITER")
      : organizedLeads;
    return pool;
  }, [workspace.leads, organizedLeads, showArchived]);

  const displayedLeads = useMemo(
    () => sortLeads(filterLeads(allOrganized, tableFilter), sort),
    [allOrganized, tableFilter, sort],
  );

  const archivedCount = useMemo(
    () => workspace.leads.filter((l) => l.workflowStatus === "ARCHIVE").length,
    [workspace.leads],
  );

  const selectedLead = useMemo(
    () => allOrganized.find((lead) => lead.id === selectedLeadId) ?? null,
    [allOrganized, selectedLeadId],
  );

  const handlers: LeadsViewHandlers = useMemo(
    () => ({
      ...baseHandlers,
      onOpenDetail: setSelectedLeadId,
      onLeadUpdated: replaceLead,
    }),
    [baseHandlers, replaceLead],
  );

  const viewProps = useMemo(
    () => ({
      leads: displayedLeads,
      copy,
      locale,
      businessName,
      ...handlers,
    }),
    [displayedLeads, copy, locale, businessName, handlers],
  );

  const toggleSelect = useCallback((leadId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  }, []);

  const toggleSelectAll = () => {
    if (displayedLeads.every((lead) => selectedIds.has(lead.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedLeads.map((lead) => lead.id)));
    }
  };

  const bulkMarkDone = () => {
    selectedIds.forEach((id) =>
      baseHandlers.onWorkflowStatusChange(id, "GAGNE_EN_COURS"),
    );
    setSelectedIds(new Set());
  };

  const bulkArchive = () => {
    selectedIds.forEach((id) => baseHandlers.onWorkflowStatusChange(id, "ARCHIVE"));
    setSelectedIds(new Set());
  };

  const handleViewChange = (next: OrganizeDisplayView) => {
    setView(next);
    if (next === "pipeline") setSelectedIds(new Set());
  };

  const sectionTabs = [
    {
      id: "list" as const,
      label: copy.leads.views.listSection,
      icon: <FaList className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "calendar" as const,
      label: copy.leads.views.calendarSection,
      icon: <FaCalendarDays className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "stats" as const,
      label: copy.leads.views.statsSection,
      icon: <FaChartPie className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  const viewTabs = [
    {
      id: "table" as const,
      label: copy.leads.views.table,
      icon: <FaTableColumns className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "cards" as const,
      label: copy.leads.views.cards,
      icon: <FaList className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "pipeline" as const,
      label: copy.leads.views.pipeline,
      icon: <FaGrip className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  const supportsBulkSelect = section === "list" && (view === "table" || view === "cards");
  const calendarLeads = useMemo(() => sortedOrganizedLeads, [sortedOrganizedLeads]);

  return (
    <section className="space-y-0">
      <DashboardPageHeader
        title={o.title}
        subtitle={o.subtitle}
        badge={<span className="db-badge">{quotaLabel}</span>}
        actions={
          <DashboardExportCsvButton
            leads={sortedOrganizedLeads}
            copy={copy}
            locale={locale}
          />
        }
      />

      <div className="db-organize-shell rounded-xl p-4 md:p-5">
        {catchUpLead ? (
          <SmartCatchUpBanner
            lead={catchUpLead}
            copy={copy}
            onAction={handleCatchUp}
            busy={catchUpBusy}
            error={catchUpError}
            onDismissError={() => setCatchUpError(null)}
          />
        ) : null}

        {whatsappError ? (
          <div
            role="alert"
            className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            <div>
              <p className="font-semibold">{copy.leads.whatsappError.title}</p>
              <p className="mt-0.5 text-red-800">{whatsappError}</p>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappError(null)}
              className="shrink-0 text-xs font-semibold text-red-700 underline"
            >
              {copy.leads.whatsappError.dismiss}
            </button>
          </div>
        ) : null}

        {loadError ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            {loadError}
          </div>
        ) : null}

        <DashboardViewTabs
          tabs={sectionTabs}
          active={section}
          onChange={setSection}
          ariaLabel={copy.leads.views.sectionAriaLabel}
        />

        {section === "list" ? (
          <DashboardViewTabs
            tabs={viewTabs}
            active={view}
            onChange={handleViewChange}
            ariaLabel={copy.leads.views.ariaLabel}
          />
        ) : null}

        <div className="mt-4">
          {section === "stats" ? (
            <ProFeatureGuard
              feature="stats"
              proAccess={profile}
              copy={copy}
              locale={locale}
            >
              <LeadsStatisticsPanel
                leads={workspace.leads}
                copy={copy}
                locale={locale}
              />
            </ProFeatureGuard>
          ) : section === "calendar" ? (
            <ProFeatureGuard
              feature="calendar"
              proAccess={profile}
              copy={copy}
              locale={locale}
            >
              <LeadsCalendar
                leads={calendarLeads}
                copy={copy}
                locale={locale}
                onOpenDetail={setSelectedLeadId}
              />
            </ProFeatureGuard>
          ) : (
            <>
              {!showArchived && view !== "pipeline" ? (
                <LeadsSummaryCards stats={summaryStats} copy={copy} />
              ) : null}

              {supportsBulkSelect && selectedIds.size > 0 ? (
                <LeadsBulkActionsBar
                  count={selectedIds.size}
                  copy={copy}
                  onMarkDone={bulkMarkDone}
                  onArchive={bulkArchive}
                  onClear={() => setSelectedIds(new Set())}
                />
              ) : null}

              {displayedLeads.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[#EFA188]/35 bg-white/70 py-16 text-center text-sm text-[#5b6478]">
                  {o.empty}
                </p>
              ) : view === "table" ? (
                <>
                  <LeadsTableToolbar
                    filter={tableFilter}
                    onFilterChange={setTableFilter}
                    showArchived={showArchived}
                    onShowArchivedChange={setShowArchived}
                    archivedCount={archivedCount}
                    copy={copy}
                  />
                  <LeadsTableView
                    {...viewProps}
                    sort={sort}
                    onSortChange={setSort}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                  />
                </>
              ) : (
                <div className="space-y-3">
                  {view === "cards" ? (
                    <LeadsCardsToolbar
                      sort={sort}
                      onSortChange={setSort}
                      showArchived={showArchived}
                      onShowArchivedChange={setShowArchived}
                      archivedCount={archivedCount}
                      copy={copy}
                    />
                  ) : null}
                  {view === "pipeline" ? (
                    <>
                      {archivedCount > 0 ? (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowArchived(!showArchived)}
                            className={`text-xs font-semibold transition ${
                              showArchived
                                ? "text-[#212129] underline"
                                : "text-[#5b6478] hover:text-[#212129]"
                            }`}
                          >
                            {showArchived
                              ? copy.leads.sort.hideArchived
                              : copy.leads.sort.showArchived.replace(
                                  "{count}",
                                  String(archivedCount),
                                )}
                          </button>
                        </div>
                      ) : null}
                      <p className="text-xs text-[#5b6478]">
                        {copy.leads.pipeline.singleDragHint}
                      </p>
                      <LeadsPipelineView {...viewProps} leads={displayedLeads} />
                    </>
                  ) : (
                    <ul className="space-y-2">
                      {displayedLeads.map((lead) => (
                        <li
                          key={lead.id}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest("input, button, a")) return;
                            setSelectedLeadId(lead.id);
                          }}
                          className="cursor-pointer"
                        >
                          <LeadCard
                            lead={lead}
                            {...viewProps}
                            selectable
                            selected={selectedIds.has(lead.id)}
                            onToggleSelect={() => toggleSelect(lead.id)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <WhatsAppUpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          copy={copy}
          locale={locale}
          clicksUsed={dashboardUser.whatsappClicksThisMonth}
        />
      </div>

      {selectedLead ? (
        <LeadDetailPanel
          lead={selectedLead}
          plan={dashboardUser.plan}
          copy={copy}
          locale={locale}
          businessName={businessName}
          onClose={() => setSelectedLeadId(null)}
          onLeadUpdated={replaceLead}
          onDelayStatusChange={(status) =>
            handlers.onDelayStatusChange(selectedLead.id, status)
          }
          onWorkflowStatusChange={(status) =>
            handlers.onWorkflowStatusChange(selectedLead.id, status)
          }
          onScheduleChange={(schedule) =>
            handlers.onScheduleChange(selectedLead.id, schedule)
          }
          onWhatsAppContact={handlers.onWhatsAppContact}
        />
      ) : null}
    </section>
  );
}
