import { createClient, type SupabaseClient } from "@supabase/supabase-js";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Ws from "ws";

/** Client service role pour scripts Node (évite l'erreur WebSocket < Node 22). */
export function createScriptAdminClient(
  url: string,
  serviceKey: string,
): SupabaseClient {
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: Ws as unknown as typeof WebSocket },
  });
}
