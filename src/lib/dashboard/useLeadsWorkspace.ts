"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getWhatsAppQuotaAction, registerWhatsAppClickAction } from "@/app/actions/dashboard";
import { catchUpLeadAction, updateLeadAction } from "@/app/actions/leads";
import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus, LeadSchedule, LeadWorkflowStatus } from "@/domain/lead";
import type { Profile } from "@/domain/profile";
import {
  profileToDashboardUser,
  type DashboardUser,
} from "@/domain/dashboardUser";
import type { LeadsViewHandlers } from "@/components/dashboard/leads/leadsViewTypes";
import {
  ESSENTIAL_WHATSAPP_CLICK_LIMIT,
  isWhatsAppQuotaExhausted,
  whatsappClicksRemaining,
} from "@/lib/dashboard/whatsappQuota";
import type { LeadWhatsAppLinks } from "@/lib/leads/buildLeadWhatsAppLink";
import { openWhatsAppLinks } from "@/lib/leads/openWhatsApp";
import { computeLeadsSummary } from "@/lib/leads/leadStats";
import { findCatchUpLead } from "@/lib/leads/smartCatchUp";
import type { CatchUpAction } from "@/lib/leads/smartCatchUp";
import { DEFAULT_LEAD_SORT, sortLeads, type LeadSortState } from "@/lib/leads/sortLeads";
import type { DashboardDictionary } from "@/i18n/types";

const DELAY_WEIGHT: Record<LeadDelayStatus, number> = {
  urgent: 0,
  asap: 1,
  planned: 2,
  info: 3,
};

function sortByPriority(leads: DashboardLead[]): DashboardLead[] {
  return [...leads].sort((a, b) => {
    const delayDiff = DELAY_WEIGHT[a.delayStatus] - DELAY_WEIGHT[b.delayStatus];
    if (delayDiff !== 0) return delayDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/** Demandes brutes — aucune action artisan (statut « Nouveau »). */
export function filterNewLeads(leads: DashboardLead[]): DashboardLead[] {
  return sortByPriority(leads.filter((lead) => lead.workflowStatus === "A_TRAITER"));
}

/** Demandes validées et en suivi (hors boîte de réception et archives). */
export function filterOrganizedLeads(leads: DashboardLead[]): DashboardLead[] {
  return leads.filter(
    (lead) => lead.workflowStatus !== "A_TRAITER" && lead.workflowStatus !== "ARCHIVE",
  );
}

type UseLeadsWorkspaceOptions = {
  profile: Profile;
  copy: DashboardDictionary;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
};

export function useLeadsWorkspace({
  profile,
  copy,
  initialLeads,
  initialLoadError,
}: UseLeadsWorkspaceOptions) {
  const [leads, setLeads] = useState<DashboardLead[]>(initialLeads);
  const [dashboardUser, setDashboardUser] = useState<DashboardUser>(() =>
    profileToDashboardUser(profile),
  );
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(initialLoadError);
  const [catchUpBusy, setCatchUpBusy] = useState(false);
  const [catchUpError, setCatchUpError] = useState<string | null>(null);

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
    setLeads(initialLeads);
    setLoadError(initialLoadError);
  }, [initialLeads, initialLoadError]);

  const newLeads = useMemo(() => filterNewLeads(leads), [leads]);
  const organizedLeads = useMemo(() => filterOrganizedLeads(leads), [leads]);
  const summaryStats = useMemo(() => computeLeadsSummary(leads), [leads]);
  const catchUpLead = useMemo(() => findCatchUpLead(organizedLeads), [organizedLeads]);

  const updateLead = useCallback((leadId: string, patch: Partial<DashboardLead>) => {
    setLeads((prev) =>
      prev.map((item) => (item.id === leadId ? { ...item, ...patch } : item)),
    );
    void updateLeadAction(leadId, patch).then((result) => {
      if (result.ok) {
        setLeads((prev) =>
          prev.map((item) => (item.id === leadId ? result.lead : item)),
        );
      }
    });
  }, []);

  const replaceLead = useCallback((lead: DashboardLead) => {
    setLeads((prev) => prev.map((item) => (item.id === lead.id ? lead : item)));
  }, []);

  const validateAndPlanLead = useCallback(
    (leadId: string, schedule?: LeadSchedule | null) => {
      updateLead(leadId, {
        workflowStatus: "DEVIS_A_FAIRE",
        ...(schedule !== undefined ? { schedule } : {}),
      });
    },
    [updateLead],
  );

  const archiveLead = useCallback(
    (leadId: string) => {
      updateLead(leadId, { workflowStatus: "ARCHIVE" });
    },
    [updateLead],
  );

  const handleCatchUp = useCallback(
    (leadId: string, action: CatchUpAction) => {
      setCatchUpBusy(true);
      setCatchUpError(null);
      void catchUpLeadAction(leadId, action).then((result) => {
        setCatchUpBusy(false);
        if (result.ok) {
          replaceLead(result.lead);
        } else {
          setCatchUpError(result.message);
        }
      });
    },
    [replaceLead],
  );

  const handleWhatsAppContact = useCallback(
    async (leadId: string, links: LeadWhatsAppLinks) => {
      setWhatsappError(null);

      if (
        dashboardUser.plan !== "PRO" &&
        isWhatsAppQuotaExhausted(dashboardUser.plan, dashboardUser.whatsappClicksThisMonth)
      ) {
        setUpgradeOpen(true);
        return;
      }

      const markContacted = () => {
        const lead = leads.find((item) => item.id === leadId);
        updateLead(leadId, {
          contactStatus: "contacted",
          contactedAt: new Date().toISOString(),
          ...(lead?.workflowStatus === "A_TRAITER"
            ? { workflowStatus: "DEVIS_A_FAIRE" as const }
            : {}),
        });
      };

      const popup = openWhatsAppLinks(links);

      if (dashboardUser.plan === "PRO") {
        markContacted();
        return;
      }

      const result = await registerWhatsAppClickAction();

      if (!result.ok) {
        popup?.close();
        setWhatsappError(result.message);
        return;
      }

      setDashboardUser((prev) => ({
        ...prev,
        whatsappClicksThisMonth: result.clicks,
      }));

      if (!result.allowed) {
        popup?.close();
        setUpgradeOpen(true);
        return;
      }

      markContacted();
    },
    [dashboardUser.plan, dashboardUser.whatsappClicksThisMonth, updateLead, leads],
  );

  const handlers: LeadsViewHandlers = useMemo(
    () => ({
      onOpenDetail: () => {},
      onDelayStatusChange: (leadId, status: LeadDelayStatus) =>
        updateLead(leadId, { delayStatus: status }),
      onWorkflowStatusChange: (leadId, status: LeadWorkflowStatus) =>
        updateLead(leadId, { workflowStatus: status }),
      onScheduleChange: (leadId, schedule: LeadSchedule | null) =>
        updateLead(leadId, { schedule }),
      onWhatsAppContact: (leadId, href) => {
        void handleWhatsAppContact(leadId, href);
      },
    }),
    [handleWhatsAppContact, updateLead],
  );

  const quotaLabel =
    dashboardUser.plan === "PRO"
      ? copy.leads.whatsappQuota.unlimited
      : copy.leads.whatsappQuota.limited
          .replace("{used}", String(dashboardUser.whatsappClicksThisMonth))
          .replace("{limit}", String(ESSENTIAL_WHATSAPP_CLICK_LIMIT))
          .replace(
            "{remaining}",
            String(
              whatsappClicksRemaining(
                dashboardUser.plan,
                dashboardUser.whatsappClicksThisMonth,
              ),
            ),
          );

  const sortedOrganizedLeads = useMemo(
    () => sortLeads(organizedLeads, DEFAULT_LEAD_SORT as LeadSortState),
    [organizedLeads],
  );

  return {
    leads,
    newLeads,
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
    handlers,
    updateLead,
    replaceLead,
    validateAndPlanLead,
    archiveLead,
    handleCatchUp,
    businessName: profile.full_name ?? undefined,
  };
}
