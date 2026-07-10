import type { AuthError } from "@supabase/supabase-js";

/** Pas de cookie session — normal sur login/signup avant connexion. */
export function isMissingAuthSessionError(error: AuthError | null | undefined): boolean {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";
  return (
    message.includes("auth session missing") ||
    message.includes("session missing") ||
    error.name === "AuthSessionMissingError"
  );
}
