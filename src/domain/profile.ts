import type { PlanTierValue } from "@/config/planTier";
import type { StoredVitrineConfig } from "@/domain/vitrinePresentation";

/** Rôle dans l’espace de travail (multi-tenant). */
export type ProfileRole = "ADMIN";

/** Offre / palier métier — aligné sur l’enum Supabase `plan_tier`. */
export type PlanTier = PlanTierValue;

export type Profile = {
  id: string;
  workspace_id: string;
  role: ProfileRole;
  plan_tier: PlanTier;
  full_name: string | null;
  whatsapp_number: string | null;
  page_slug: string | null;
  onboarding_completed_at: string | null;
  whatsapp_clicks_this_month?: number;
  whatsapp_clicks_month_key?: string | null;
  voice_capture_enabled?: boolean;
  vitrine_presentation?: StoredVitrineConfig | null;
  /** Certifications & diplômes (badges vitrine publique). */
  certifications?: string[];
  created_at: string | null;
  updated_at: string | null;
};

export type CreateProfileInput = {
  userId: string;
  fullName?: string;
  proPhoneNumber?: string;
};
