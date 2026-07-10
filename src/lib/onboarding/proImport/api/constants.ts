export const SERVER_CONFIG_ERROR = "Server configuration error";

export const PROVIDER_QUOTA_EXHAUSTED = "PROVIDER_QUOTA_EXHAUSTED" as const;

export const PROVIDER_DEGRADED_MESSAGE =
  "Automated import temporarily unavailable.";

/** Codes d'erreur import — renvoyés au client, mappés en i18n. */
export const IMPORT_INVALID_IDENTIFIER = "IMPORT_INVALID_IDENTIFIER";
export const IMPORT_INSTAGRAM_NOT_FOUND = "IMPORT_INSTAGRAM_NOT_FOUND";
export const IMPORT_FACEBOOK_NOT_FOUND = "IMPORT_FACEBOOK_NOT_FOUND";
export const IMPORT_GOOGLE_NOT_FOUND = "IMPORT_GOOGLE_NOT_FOUND";
export const IMPORT_PROVIDER_ERROR = "IMPORT_PROVIDER_ERROR";
export const IMPORT_QUOTA_EXCEEDED = "IMPORT_QUOTA_EXCEEDED";
export const IMPORT_AUTH_REQUIRED = "IMPORT_AUTH_REQUIRED";

/** Apify : token invalide ou accès refusé. */
export const APIFY_AUTH_ERROR = "APIFY_AUTH_ERROR";
