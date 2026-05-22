export type CookieCategory = "necessary" | "analytics" | "marketing";

export type CookieConsentPreferences = {
  version: 1;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_VERSION = 1 as const;
export const COOKIE_CONSENT_STORAGE_KEY = "craftlink_cookie_consent";

export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  version: COOKIE_CONSENT_VERSION,
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};
