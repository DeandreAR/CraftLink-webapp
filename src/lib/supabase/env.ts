/**
 * Variables Supabase — accès direct à process.env.NEXT_PUBLIC_*
 * pour que Next.js les injecte dans le bundle client.
 */

const PLACEHOLDER_URL =
  /ton_url|ta_cle|your[-_]?supabase|example\.com|changeme|placeholder/i;

const PLACEHOLDER_KEY =
  /ta_cle|your[-_]?key|changeme|placeholder|example/i;

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikePlaceholder(url: string): boolean {
  return PLACEHOLDER_URL.test(url);
}

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

/** Retourne la config si elle est utilisable ; sinon null (sans lever d’exception). */
export function getSupabaseConfig(): SupabasePublicConfig | null {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey =
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (!url || !anonKey) return null;
  if (!isValidHttpUrl(url) || looksLikePlaceholder(url)) return null;
  if (looksLikePlaceholder(anonKey) || PLACEHOLDER_KEY.test(anonKey)) return null;
  if (!anonKey.startsWith("eyJ") && !anonKey.startsWith("sb_publishable_")) {
    return null;
  }

  return { url, anonKey };
}

function logConfigIssue(detail: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`[supabase] ${detail}`);
  }
}

export function getSupabaseUrl(): string {
  const config = getSupabaseConfig();
  if (!config) {
    logConfigIssue(
      "Configuration invalide ou manquante (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY dans .env.local). Redémarrez npm run dev après modification.",
    );
    throw new Error(SUPABASE_UNAVAILABLE_MESSAGE);
  }
  return config.url;
}

export function getSupabaseAnonKey(): string {
  const config = getSupabaseConfig();
  if (!config) {
    logConfigIssue("Clé anon Supabase manquante ou invalide.");
    throw new Error(SUPABASE_UNAVAILABLE_MESSAGE);
  }
  return config.anonKey;
}

/** Message affiché à l’utilisateur — jamais d’URL ni de nom de variable. */
export const SUPABASE_UNAVAILABLE_MESSAGE =
  "Le service est momentanément indisponible. Réessayez dans quelques minutes ou contactez le support.";

/** Clé service role — uniquement côté serveur. */
export function getSupabaseServiceRoleKey(): string | undefined {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}
