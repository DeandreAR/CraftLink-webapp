"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCalendarDays, FaGrip, FaList, FaTableColumns } from "react-icons/fa6";
import { getWhatsAppQuotaAction, registerWhatsAppClickAction } from "@/app/actions/dashboard";
import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus, LeadSchedule } from "@/domain/lead";
import type { Profile } from "@/domain/profile";
import {
  profileToDashboardUser,
  type DashboardUser,
} from "@/domain/dashboardUser";
import { DashboardViewTabs } from "@/components/dashboard/DashboardViewTabs";
import { LeadDetailPanel } from "@/components/dashboard/leads/LeadDetailPanel";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import { LeadsBulkActionsBar } from "@/components/dashboard/leads/LeadsBulkActionsBar";
import { LeadsCalendar } from "@/components/dashboard/leads/LeadsCalendar";
import { LeadsCardsToolbar } from "@/components/dashboard/leads/LeadsCardsToolbar";
import { LeadsPipelineView } from "@/components/dashboard/leads/LeadsPipelineView";
import { LeadsSummaryCards } from "@/components/dashboard/leads/LeadsSummaryCards";
import { LeadsTableView } from "@/components/dashboard/leads/LeadsTableView";
import { WhatsAppUpgradeModal } from "@/components/dashboard/leads/WhatsAppUpgradeModal";
import type { LeadsViewHandlers } from "@/components/dashboard/leads/leadsViewTypes";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import {
  ESSENTIAL_WHATSAPP_CLICK_LIMIT,
  whatsappClicksRemaining,
} from "@/lib/dashboard/whatsappQuota";
import { computeLeadsSummary } from "@/lib/leads/leadStats";
import { DEFAULT_LEAD_SORT, sortLeads, type LeadSortState } from "@/lib/leads/sortLeads";
import { getWorkspaceLeads } from "@/services/leadService";

export type LeadsDisplayView = "table" | "cards" | "pipeline";
export type LeadsSectionView = "list" | "calendar";

type LeadsPanelProps = {
  workspaceId: string;
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function LeadsPanel({ workspaceId, profile, copy, locale }: LeadsPanelProps) {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<LeadsDisplayView>("table");
  const [section, setSection] = useState<LeadsSectionView>("list");
  const [sort, setSort] = useState<LeadSortState>(DEFAULT_LEAD_SORT);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dashboardUser, setDashboardUser] = useState<DashboardUser>(() =>
    profileToDashboardUser(profile),
  );
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const l = copy.leads;

  useEffect(() => {
    setDashboardUser(profileToDashboardUser(profile));
  }, [profile]);

  useEffect(() => {
    void getWhatsAppQuotaAction().then((result) => {
      if (result.ok) {
        setDashboardUser((prev) => ({
          ...prev,
          plan: result.quota.plan,
          whatsappClicksThisMonth: result.quota.clicks,
        }));
      }
    });
  }, [profile.id]);

  useEffect(() => {
    let cancelled = false;
    void getWorkspaceLeads(workspaceId).then((data) => {
      if (!cancelled) {
        setLeads(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  const updateLead = useCallback((leadId: string, patch: Partial<DashboardLead>) => {
    setLeads((prev) =>
      prev.map((item) => (item.id === leadId ? { ...item, ...patch } : item)),
    );
  }, []);

  const handleWhatsAppContact = useCallback(
    async (href: string) => {
      if (dashboardUser.plan === "PRO") {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      const result = await registerWhatsAppClickAction();
      if (!result.ok) return;

      setDashboardUser((prev) => ({
        ...prev,
        whatsappClicksThisMonth: result.clicks,
      }));

      if (!result.allowed) {
        setUpgradeOpen(true);
        return;
      }

      window.open(href, "_blank", "noopener,noreferrer");
    },
    [dashboardUser.plan],
  );

  const handlers: LeadsViewHandlers = useMemo(
    () => ({
      onOpenDetail: setSelectedLeadId,
      onDelayStatusChange: (leadId, status: LeadDelayStatus) =>
        updateLead(leadId, { delayStatus: status }),
      onScheduleChange: (leadId, schedule: LeadSchedule | null) =>
        updateLead(leadId, { schedule }),
      onMarkDone: (leadId) => updateLead(leadId, { workflowStatus: "done" }),
      onMarkArchived: (leadId) => updateLead(leadId, { workflowStatus: "archived" }),
      onReactivate: (leadId) => updateLead(leadId, { workflowStatus: "active" }),
      onWhatsAppContact: (href) => {
        void handleWhatsAppContact(href);
      },
    }),
    [updateLead, handleWhatsAppContact],
  );

  const archivedCount = leads.filter((item) => item.workflowStatus === "archived").length;
  const summaryStats = useMemo(() => computeLeadsSummary(leads), [leads]);

  const displayedLeads = useMemo(() => {
    const filtered = leads.filter((item) =>
      showArchived
        ? item.workflowStatus === "archived"
        : item.workflowStatus !== "archived",
    );
    return sortLeads(filtered, sort);
  }, [leads, sort, showArchived]);

  const selectedLead = selectedLeadId
    ? leads.find((item) => item.id === selectedLeadId) ?? null
    : null;

  const viewProps = {
    leads: displayedLeads,
    copy,
    locale,
    artisanName: profile.full_name ?? undefined,
    ...handlers,
  };

  const remaining = whatsappClicksRemaining(
    dashboardUser.plan,
    dashboardUser.whatsappClicksThisMonth,
  );

  const quotaLabel =
    dashboardUser.plan === "PRO"
      ? l.whatsappQuota.unlimited
      : l.whatsappQuota.limited
          .replace("{used}", String(dashboardUser.whatsappClicksThisMonth))
          .replace("{limit}", String(ESSENTIAL_WHATSAPP_CLICK_LIMIT))
          .replace("{remaining}", String(remaining ?? 0));

  const toggleSelect = (leadId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (displayedLeads.every((lead) => selectedIds.has(lead.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedLeads.map((lead) => lead.id)));
    }
  };

  const bulkMarkDone = () => {
    selectedIds.forEach((id) => updateLead(id, { workflowStatus: "done" }));
    setSelectedIds(new Set());
  };

  const bulkArchive = () => {
    selectedIds.forEach((id) => updateLead(id, { workflowStatus: "archived" }));
    setSelectedIds(new Set());
  };

  const handleViewChange = (next: LeadsDisplayView) => {
    setView(next);
    if (next === "pipeline") setSelectedIds(new Set());
  };

  const viewTabs = [
    {
      id: "table" as const,
      label: l.views.table,
      icon: <FaTableColumns className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "cards" as const,
      label: l.views.cards,
      icon: <FaList className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "pipeline" as const,
      label: l.views.pipeline,
      icon: <FaGrip className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  const sectionTabs = [
    {
      id: "list" as const,
      label: l.views.listSection,
      icon: <FaList className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "calendar" as const,
      label: l.views.calendarSection,
      icon: <FaCalendarDays className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  const supportsBulkSelect = section === "list" && (view === "table" || view === "cards");
  const calendarLeads = useMemo(
    () => leads.filter((item) => item.workflowStatus !== "archived"),
    [leads],
  );

  return (
    <section className="space-y-0">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
            {l.title}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">{l.subtitle}</p>
        </div>
        <p
          className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-medium sm:self-auto ${
            dashboardUser.plan === "PRO"
              ? "bg-slate-100 text-slate-600"
              : "bg-amber-50 text-amber-900 ring-1 ring-amber-100"
          }`}
        >
          {quotaLabel}
        </p>
      </header>

      <DashboardViewTabs
        tabs={sectionTabs}
        active={section}
        onChange={setSection}
        ariaLabel={l.views.sectionAriaLabel}
      />

      {section === "list" ? (
        <DashboardViewTabs
          tabs={viewTabs}
          active={view}
          onChange={handleViewChange}
          ariaLabel={l.views.ariaLabel}
        />
      ) : null}

      <div className="mt-4">
        {loading ? (
          <p className="py-12 text-center text-sm text-slate-400">{copy.loading}</p>
        ) : section === "calendar" ? (
          <LeadsCalendar
            leads={calendarLeads}
            copy={copy}
            locale={locale}
            onOpenDetail={setSelectedLeadId}
          />
        ) : (
          <>
            {!showArchived && view !== "pipeline" ? (
              <LeadsSummaryCards stats={summaryStats} copy={copy} />
            ) : null}

            {supportsBulkSelect ? (
              <LeadsBulkActionsBar
                count={selectedIds.size}
                copy={copy}
                onMarkDone={bulkMarkDone}
                onArchive={bulkArchive}
                onClear={() => setSelectedIds(new Set())}
              />
            ) : null}

            {displayedLeads.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 py-16 text-center text-sm text-slate-400">
                {showArchived ? l.emptyArchived : l.empty}
              </p>
            ) : view === "table" ? (
              <LeadsTableView
                {...viewProps}
                sort={sort}
                onSortChange={setSort}
                showArchived={showArchived}
                onShowArchivedChange={setShowArchived}
                archivedCount={archivedCount}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
              />
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
                              ? "text-slate-900 underline"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {showArchived
                            ? l.sort.hideArchived
                            : l.sort.showArchived.replace("{count}", String(archivedCount))}
                        </button>
                      </div>
                    ) : null}
                    <p className="text-xs text-slate-500">{l.pipeline.singleDragHint}</p>
                    <LeadsPipelineView {...viewProps} />
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

      {selectedLead ? (
        <LeadDetailPanel
          lead={selectedLead}
          copy={copy}
          locale={locale}
          artisanName={profile.full_name ?? undefined}
          onClose={() => setSelectedLeadId(null)}
          onDelayStatusChange={(status) =>
            handlers.onDelayStatusChange(selectedLead.id, status)
          }
          onMarkDone={() => handlers.onMarkDone(selectedLead.id)}
          onMarkArchived={() => handlers.onMarkArchived(selectedLead.id)}
          onReactivate={() => handlers.onReactivate(selectedLead.id)}
          onScheduleChange={(schedule) =>
            handlers.onScheduleChange(selectedLead.id, schedule)
          }
          onWhatsAppContact={handlers.onWhatsAppContact}
        />
      ) : null}

      <WhatsAppUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        copy={copy}
        locale={locale}
        clicksUsed={dashboardUser.whatsappClicksThisMonth}
      />
    </section>
  );
}
