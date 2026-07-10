export type PartnershipType = "advertising" | "ugc" | "product_test" | "other";

export type PartnershipBudgetRange =
  | "under_5k"
  | "from_5k_to_15k"
  | "from_15k_to_50k"
  | "over_50k"
  | "undisclosed";

export type PartnershipWorkflowStatus = "A_TRAITER" | "CONTACTE" | "ARCHIVE";

export type DashboardPartnershipRequest = {
  id: string;
  companyName: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  budgetRange: PartnershipBudgetRange | null;
  budgetApproximate: string | null;
  message: string;
  workflowStatus: PartnershipWorkflowStatus;
  createdAt: string;
  updatedAt: string;
};

export type PublicPartnershipCaptureInput = {
  pageSlug: string;
  companyName: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  budgetRange: PartnershipBudgetRange | null;
  budgetApproximate: string | null;
  message: string;
};

export type PublicPartnershipCaptureResult =
  | { ok: true; requestId: string }
  | { ok: false; message: string };
