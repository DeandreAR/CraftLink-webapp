import type { AuthError, PostgrestError } from "@supabase/supabase-js";

type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

export const AUTH_GENERIC_ERROR =
  "Une erreur est survenue. Réessayez dans quelques instants.";

export const AUTH_SERVICE_UNAVAILABLE =
  "Le service est momentanément indisponible. Réessayez dans quelques instants ou contactez le support.";

export function logAuthError(context: string, error: unknown): void {
  console.error(`Détail du bug auth [${context}]:`, error);
}

/** Log technique en console ; retourne uniquement le message affiché à l'utilisateur. */
export function formatAuthDebugMessage(
  context: string,
  error: SupabaseLikeError | AuthError | unknown,
  clientMessage: string,
): string {
  logAuthError(context, error ?? clientMessage);
  return clientMessage;
}

/** Log technique en console ; retourne uniquement le message affiché à l'utilisateur. */
export function formatConfigDebugMessage(
  context: string,
  clientMessage: string,
  technicalDetail?: unknown,
): string {
  logAuthError(context, technicalDetail ?? clientMessage);
  return clientMessage;
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
