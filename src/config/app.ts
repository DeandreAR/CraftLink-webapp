const DEFAULT_APP_URL = "https://getcraftlink.com";

/** URL publique du site (avec protocole, sans slash final). */
export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return DEFAULT_APP_URL;
  return raw.replace(/\/+$/, "");
}

/** Nom de domaine affiché (sans protocole). */
export function getAppHostname(): string {
  try {
    return new URL(getAppUrl()).hostname;
  } catch {
    return "getcraftlink.com";
  }
}

/** Construit une URL absolue à partir d'un chemin (`/share/abc`). */
export function buildAppUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppUrl()}${normalizedPath}`;
}

/** E-mail expéditeur transactionnel (Resend). */
export function getTransactionalFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ??
    `CraftLink <notifications@${getAppHostname()}>`
  );
}

/** E-mail de contact affiché (pages légales, support). */
export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? `contact@${getAppHostname()}`;
}
