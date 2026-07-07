import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchPublicLeadShare,
  type PublicLeadShareRow,
} from "@/lib/leads/leadRepository";

export type PublicLeadShare = PublicLeadShareRow;

/** Dossier public `/share/:id` — lecture via service role (pas d'auth client). */
export async function getPublicLeadShare(leadId: string): Promise<PublicLeadShare | null> {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[getPublicLeadShare] SUPABASE_SERVICE_ROLE_KEY manquant.");
    return null;
  }

  return fetchPublicLeadShare(admin, leadId);
}
