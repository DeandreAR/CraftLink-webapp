import { getAppUrl, canonicalAppOrigin } from "@/config/app";
import { defaultLocale, type Locale } from "@/i18n/config";
import { accountConfirmedPath } from "@/lib/auth/paths";

/** URL de retour après clic sur le lien de confirmation Supabase (à autoriser dans le dashboard). */
export function buildAuthCallbackUrl(nextPath: string, appUrl?: string): string {
  const base = normalizeOrigin(appUrl ?? getAppUrl());
  const url = new URL(`${base}/auth/callback`);
  url.searchParams.set("next", nextPath);
  return url.toString();
}

/**
 * Lien confirmation inscription dans l'e-mail Resend.
 * Passe par /auth/callback avec token_hash (évite Site URL Supabase = localhost).
 */
export function buildSignupConfirmUrl(
  lang: Locale | undefined,
  appUrl: string | undefined,
  tokenHash: string,
): string {
  const base = canonicalAppOrigin(normalizeOrigin(appUrl ?? getAppUrl()));
  const locale = lang ?? defaultLocale;
  const url = new URL(`${base}/auth/callback`);
  url.searchParams.set("token_hash", tokenHash);
  url.searchParams.set("type", "signup");
  url.searchParams.set("next", accountConfirmedPath(locale));
  return url.toString();
}

/**
 * Lien recovery dans l'e-mail — Route Handler /auth/recovery (session + redirect formulaire).
 */
export function buildPasswordRecoveryConfirmUrl(
  lang: Locale | undefined,
  appUrl: string | undefined,
  tokenHash: string,
): string {
  const base = canonicalAppOrigin(normalizeOrigin(appUrl ?? getAppUrl()));
  const locale = lang ?? defaultLocale;
  const url = new URL(`${base}/auth/recovery`);
  url.searchParams.set("token_hash", tokenHash);
  if (locale !== defaultLocale) {
    url.searchParams.set("locale", locale);
  }
  return url.toString();
}

/** @deprecated Ancien flux via redirect Supabase — conservé pour scripts / docs. */
export function buildPasswordResetCallbackUrl(
  lang: Locale | undefined,
  appUrl?: string,
): string {
  const base = normalizeOrigin(appUrl ?? getAppUrl());
  const locale = lang ?? defaultLocale;
  if (locale === defaultLocale) {
    return `${base}/auth/callback/reset-password`;
  }
  return `${base}/auth/callback/${locale}/reset-password`;
}

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, "");
}
