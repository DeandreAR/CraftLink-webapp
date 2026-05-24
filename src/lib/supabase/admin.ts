import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/**
 * Client admin (service role) — jamais exposé au navigateur.
 * Utilisé en secours pour créer `profiles` si la session n’existe pas encore (email confirmation).
 */
export function createAdminClient() {
  const serviceKey = getSupabaseServiceRoleKey();
  if (!serviceKey) {
    return null;
  }
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
