import { canonicalAppOrigin, getAppUrl } from "@/config/app";

const DEFAULT_PRODUCTION_URL = "https://getcraftlink.com";

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function isLocalOrigin(origin: string): boolean {
  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function isAllowedHost(host: string): boolean {
  const hostname = host.toLowerCase().split(":")[0];
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.endsWith(".vercel.app")) return true;

  const allowed = new Set<string>([
    "getcraftlink.com",
    "www.getcraftlink.com",
    ...(process.env.APP_ALLOWED_HOSTS?.split(",").map((entry) => entry.trim().toLowerCase()) ??
      []),
  ]);

  try {
    allowed.add(new URL(getAppUrl()).hostname.toLowerCase());
  } catch {
    /* ignore */
  }

  return allowed.has(hostname);
}

/** Origine publique déduite de la requête HTTP (Host / X-Forwarded-*). */
export function resolveOriginFromHeaders(headers: Headers): string | null {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return null;

  const primaryHost = host.split(",")[0]?.trim();
  if (!primaryHost || !isAllowedHost(primaryHost)) return null;

  const forwardedProto = headers.get("x-forwarded-proto");
  const proto =
    forwardedProto?.split(",")[0]?.trim() ??
    (primaryHost.startsWith("localhost") || primaryHost.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return normalizeOrigin(`${proto}://${primaryHost}`);
}

/**
 * URL de base pour les liens de confirmation e-mail.
 * En dev local, on évite localhost (inutilisable sur mobile) → prod par défaut.
 */
export function getAuthCallbackBaseUrl(headers?: Headers): string {
  const explicit =
    process.env.AUTH_CALLBACK_BASE_URL?.trim() ?? process.env.APP_URL?.trim();
  return canonicalAppOrigin(
    explicit ??
      (headers
        ? (() => {
            const fromRequest = resolveOriginFromHeaders(headers);
            if (fromRequest && !isLocalOrigin(fromRequest)) return fromRequest;
            return null;
          })()
        : null) ??
      (!isLocalOrigin(getAppUrl()) ? getAppUrl() : DEFAULT_PRODUCTION_URL),
  );
}

/** Force le redirect_to du lien Supabase vers notre callback (évite Site URL localhost). */
export function normalizeSupabaseConfirmationLink(
  actionLink: string,
  redirectTo: string,
): string {
  try {
    const url = new URL(actionLink);
    url.searchParams.set("redirect_to", redirectTo);
    return url.toString();
  } catch {
    return actionLink;
  }
}

/** @deprecated Préférer getAuthCallbackBaseUrl pour les e-mails Auth. */
export function getAppUrlForServer(headers?: Headers): string {
  return getAuthCallbackBaseUrl(headers);
}
