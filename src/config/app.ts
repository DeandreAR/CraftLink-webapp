const DEFAULT_APP_URL = "https://getcraftlink.com";

function normalizeBaseUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "");
}

/** Origine canonique pour les liens e-mail (sans www). */
export function canonicalAppOrigin(raw: string): string {
  const normalized = normalizeBaseUrl(raw);
  try {
    const url = new URL(normalized);
    if (url.hostname.toLowerCase() === "www.getcraftlink.com") {
      url.hostname = "getcraftlink.com";
    }
    return url.origin;
  } catch {
    return normalized;
  }
}

/** URL publique du site (avec protocole, sans slash final). */
export function getAppUrl(): string {
  const explicit =
    process.env.APP_URL?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return normalizeBaseUrl(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${normalizeBaseUrl(vercel)}`;

  return DEFAULT_APP_URL;
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
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "contact@craftlink.fr";
}
