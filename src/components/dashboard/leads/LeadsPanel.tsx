"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaGrip, FaList, FaTableColumns } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";
import type { Profile } from "@/domain/profile";
import { DashboardViewTabs } from "@/components/dashboard/DashboardViewTabs";
import { LeadDetailPanel } from "@/components/dashboard/leads/LeadDetailPanel";
import { LeadCard } from "@/components/dashboard/leads/LeadCard";
import { LeadStatusLegend } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadsPipelineView } from "@/components/dashboard/leads/LeadsPipelineView";
import { LeadsSortBar } from "@/components/dashboard/leads/LeadsSortBar";
import { LeadsTableView } from "@/components/dashboard/leads/LeadsTableView";
import type { LeadsViewHandlers } from "@/components/dashboard/leads/leadsViewTypes";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { onboardingPath } from "@/lib/auth/paths";
import {
  ESSENTIAL_MONTHLY_LEAD_LIMIT,
  isProPlan,
} from "@/lib/dashboard/planAccess";
import { isLeadQuotaLocked, sortLeads, type LeadSortKey } from "@/lib/leads/sortLeads";
import { getWorkspaceLeads } from "@/services/leadService";

export type LeadsDisplayView = "table" | "cards" | "pipeline";

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
  const [sortKey, setSortKey] = useState<LeadSortKey>("date");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const pro = isProPlan(profile.plan_tier);
  const l = copy.leads;
  const upgradeHref = onboardingPath(locale, { plan: "pro" });

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

  const handlers: LeadsViewHandlers = useMemo(
    () => ({
      isLocked: (lead) => isLeadQuotaLocked(lead, leads, profile.plan_tier),
      onOpenDetail: setSelectedLeadId,
      onDelayStatusChange: (leadId, status: LeadDelayStatus) =>
        updateLead(leadId, { delayStatus: status }),
      onMarkDone: (leadId) => updateLead(leadId, { workflowStatus: "done" }),
      onMarkArchived: (leadId) => updateLead(leadId, { workflowStatus: "archived" }),
      onReactivate: (leadId) => updateLead(leadId, { workflowStatus: "active" }),
    }),
    [leads, profile.plan_tier, updateLead],
  );

  const archivedCount = leads.filter((item) => item.workflowStatus === "archived").length;

  const displayedLeads = useMemo(() => {
    const filtered = leads.filter((item) =>
      showArchived
        ? item.workflowStatus === "archived"
        : item.workflowStatus !== "archived",
    );
    return sortLeads(filtered, sortKey);
  }, [leads, sortKey, showArchived]);

  const visibleQuotaCount = useMemo(() => {
    if (pro) return leads.filter((item) => item.workflowStatus !== "archived").length;
    const activeLeads = leads.filter((item) => item.workflowStatus !== "archived");
    return Math.min(
      activeLeads.filter((lead) => !isLeadQuotaLocked(lead, leads, profile.plan_tier)).length,
      ESSENTIAL_MONTHLY_LEAD_LIMIT,
    );
  }, [leads, pro, profile.plan_tier]);

  const selectedLead = selectedLeadId
    ? leads.find((item) => item.id === selectedLeadId) ?? null
    : null;

  const viewProps = {
    leads: displayedLeads,
    copy,
    locale,
    artisanName: profile.full_name ?? undefined,
    lockedCtaHref: upgradeHref,
    ...handlers,
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

  return (
    <section className="space-y-0">
      <header className="mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-black md:text-[1.75rem]">
          {l.title}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{l.subtitle}</p>
      </header>

      <DashboardViewTabs
        tabs={viewTabs}
        active={view}
        onChange={setView}
        ariaLabel={l.views.ariaLabel}
      />

      <div className="mt-4 space-y-3 border-b border-neutral-100 pb-4">
        <p
          className={`inline-block rounded-md px-3 py-1.5 text-xs font-medium ${
            pro ? "bg-neutral-100 text-neutral-700" : "bg-amber-50 text-amber-900"
          }`}
        >
          {pro
            ? l.quotaUnlimited
            : l.quotaBanner
                .replace("{used}", String(visibleQuotaCount))
                .replace("{limit}", String(ESSENTIAL_MONTHLY_LEAD_LIMIT))}
        </p>
        <LeadStatusLegend copy={copy} />
        <LeadsSortBar
          sortKey={sortKey}
          onSortChange={setSortKey}
          showArchived={showArchived}
          onShowArchivedChange={setShowArchived}
          archivedCount={archivedCount}
          copy={copy}
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="py-12 text-center text-sm text-neutral-400">{copy.loading}</p>
        ) : displayedLeads.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 py-16 text-center text-sm text-neutral-400">
            {showArchived ? l.emptyArchived : l.empty}
          </p>
        ) : view === "table" ? (
          <LeadsTableView {...viewProps} />
        ) : view === "pipeline" ? (
          <LeadsPipelineView {...viewProps} />
        ) : (
          <ul className="space-y-2">
            {displayedLeads.map((lead) => (
              <li key={lead.id}>
                <LeadCard lead={lead} {...viewProps} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedLead && !handlers.isLocked(selectedLead) ? (
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
        />
      ) : null}
    </section>
  );
}
