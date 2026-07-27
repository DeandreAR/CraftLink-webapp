import { getSupabaseConfig } from "@/lib/supabase/env";

/** Origines à préconnecter (TLS/DNS) pour accélérer LCP images & fonts. */
export function getResourcePreconnectOrigins(): string[] {
  const origins = new Set<string>([
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ]);

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      origins.add(new URL(supabase.url).origin);
    } catch {
      // ignore
    }
  }

  return [...origins];
}
