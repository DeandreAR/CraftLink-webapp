import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseConfig,
  SUPABASE_UNAVAILABLE_MESSAGE,
} from "@/lib/supabase/env";

/**
 * Références directes pour l’inlining Next (évite URL vide côté client).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Client Supabase pour composants client (formulaires, hooks). */
export function createClient() {
  const inlined = getSupabaseConfig();
  if (inlined) {
    return createBrowserClient(inlined.url, inlined.anonKey);
  }

  const url = supabaseUrl?.trim();
  const key = supabaseAnonKey?.trim();
  if (url && key && url.startsWith("http")) {
    return createBrowserClient(url, key);
  }

  throw new Error(SUPABASE_UNAVAILABLE_MESSAGE);
}
