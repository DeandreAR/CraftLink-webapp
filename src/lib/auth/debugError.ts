import type { AuthError, PostgrestError } from "@supabase/supabase-js";

type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

/** En dev, les erreurs Supabase brutes sont visibles dans l’UI pour le débogage. */
export function isAuthDebugEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function logAuthError(context: string, error: unknown): void {
  console.error(`Détail du bug auth [${context}]:`, error);
}

export function formatAuthDebugMessage(
  context: string,
  error: SupabaseLikeError | AuthError | null | undefined,
  fallback: string,
): string {
  if (error) {
    logAuthError(context, error);
  }

  if (!isAuthDebugEnabled()) {
    return fallback;
  }

  if (!error?.message) {
    return `[Debug ${context}] ${fallback}`;
  }

  const parts = [
    error.message,
    error.code ? `code=${error.code}` : null,
    "details" in error && error.details ? String(error.details) : null,
    "hint" in error && error.hint ? `hint: ${error.hint}` : null,
  ].filter(Boolean);

  return `[Debug ${context}] ${parts.join(" · ")}`;
}

export function formatConfigDebugMessage(context: string, detail: string): string {
  logAuthError(context, detail);
  if (!isAuthDebugEnabled()) {
    return "Le service est momentanément indisponible. Réessayez dans quelques minutes ou contactez le support.";
  }
  return `[Debug ${context}] ${detail}`;
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
