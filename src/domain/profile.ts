/** Rôle dans l’espace de travail (multi-tenant). */
export type ProfileRole = "ADMIN";

/** Offre / palier métier (plan de base à l’inscription). */
export type PlanTier = "ALL_SOURCES";

export type Profile = {
  id: string;
  workspace_id: string;
  role: ProfileRole;
  plan_tier: PlanTier;
  full_name: string | null;
  whatsapp_number: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateProfileInput = {
  userId: string;
  fullName?: string;
  whatsappNumber?: string;
};
