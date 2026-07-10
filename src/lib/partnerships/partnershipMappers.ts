import type {
  DashboardPartnershipRequest,
  PartnershipBudgetRange,
  PartnershipType,
  PartnershipWorkflowStatus,
} from "@/domain/partnershipRequest";

export type PartnershipRequestRow = {
  id: string;
  workspace_id: string;
  company_name: string;
  contact_name: string;
  job_title: string;
  email: string;
  phone: string;
  partnership_type: string;
  budget_range: string | null;
  budget_approximate: string | null;
  message: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
};

const PARTNERSHIP_TYPES = new Set<PartnershipType>([
  "advertising",
  "ugc",
  "product_test",
  "other",
]);

const BUDGET_RANGES = new Set<PartnershipBudgetRange>([
  "under_5k",
  "from_5k_to_15k",
  "from_15k_to_50k",
  "over_50k",
  "undisclosed",
]);

const WORKFLOW_STATUSES = new Set<PartnershipWorkflowStatus>([
  "A_TRAITER",
  "CONTACTE",
  "ARCHIVE",
]);

export function mapPartnershipRowToDashboard(
  row: PartnershipRequestRow,
): DashboardPartnershipRequest {
  const partnershipType = PARTNERSHIP_TYPES.has(row.partnership_type as PartnershipType)
    ? (row.partnership_type as PartnershipType)
    : "other";

  const budgetRange =
    row.budget_range && BUDGET_RANGES.has(row.budget_range as PartnershipBudgetRange)
      ? (row.budget_range as PartnershipBudgetRange)
      : null;

  const workflowStatus = WORKFLOW_STATUSES.has(row.workflow_status as PartnershipWorkflowStatus)
    ? (row.workflow_status as PartnershipWorkflowStatus)
    : "A_TRAITER";

  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    jobTitle: row.job_title,
    email: row.email,
    phone: row.phone,
    partnershipType,
    budgetRange,
    budgetApproximate: row.budget_approximate?.trim() || null,
    message: row.message,
    workflowStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
