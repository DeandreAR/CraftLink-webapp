import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  DEFAULT_COOKIE_PREFERENCES,
  type CookieConsentPreferences,
} from "@/domain/cookieConsent";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePreferences(raw: string): CookieConsentPreferences | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data)) return null;
    if (data.version !== COOKIE_CONSENT_VERSION) return null;
    if (data.necessary !== true) return null;
    if (typeof data.analytics !== "boolean") return null;
    if (typeof data.marketing !== "boolean") return null;
    if (typeof data.updatedAt !== "string") return null;
    return {
      version: COOKIE_CONSENT_VERSION,
      necessary: true,
      analytics: data.analytics,
      marketing: data.marketing,
      updatedAt: data.updatedAt,
    };
  } catch {
    return null;
  }
}

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) return null;
  return parsePreferences(raw);
}

export function hasCookieConsentChoice(): boolean {
  return readCookieConsent() !== null;
}

/** Point d’extension : charger GA / pixels uniquement si le consentement l’autorise. */
export function applyConsentSideEffects(prefs: CookieConsentPreferences): void {
  if (typeof window === "undefined") return;
  void prefs;
  // Ex. if (prefs.analytics) loadAnalytics();
}

export function saveCookieConsent(
  prefs: Pick<CookieConsentPreferences, "analytics" | "marketing">,
): CookieConsentPreferences {
  const next: CookieConsentPreferences = {
    ...DEFAULT_COOKIE_PREFERENCES,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(next),
    );
    applyConsentSideEffects(next);
    window.dispatchEvent(new CustomEvent("craftlink:cookie-consent"));
  }
  return next;
}

export function acceptAllCookies(): CookieConsentPreferences {
  return saveCookieConsent({ analytics: true, marketing: true });
}

export function rejectOptionalCookies(): CookieConsentPreferences {
  return saveCookieConsent({ analytics: false, marketing: false });
}
