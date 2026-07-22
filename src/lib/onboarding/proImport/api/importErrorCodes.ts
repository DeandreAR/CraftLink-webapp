import {
  AI_GENERATION_QUOTA_EXCEEDED,
} from "@/lib/ai/aiGenerationQuotaShared";
import {
  APIFY_AUTH_ERROR,
  IMPORT_FACEBOOK_NOT_FOUND,
  IMPORT_GOOGLE_NOT_FOUND,
  IMPORT_INSTAGRAM_NOT_FOUND,
  IMPORT_INVALID_IDENTIFIER,
  IMPORT_PROVIDER_ERROR,
  IMPORT_QUOTA_EXCEEDED,
  SERVER_CONFIG_ERROR,
} from "@/lib/onboarding/proImport/api/constants";

const IMPORT_ERROR_CODES = new Set<string>([
  IMPORT_INVALID_IDENTIFIER,
  IMPORT_INSTAGRAM_NOT_FOUND,
  IMPORT_FACEBOOK_NOT_FOUND,
  IMPORT_GOOGLE_NOT_FOUND,
  IMPORT_PROVIDER_ERROR,
  IMPORT_QUOTA_EXCEEDED,
  AI_GENERATION_QUOTA_EXCEEDED,
  APIFY_AUTH_ERROR,
  SERVER_CONFIG_ERROR,
]);

export function isImportErrorCode(message: string): boolean {
  return IMPORT_ERROR_CODES.has(message);
}

/** Ne renvoie que des codes stables côté client (jamais de détail technique). */
export function sanitizeImportErrorForClient(message: string): string {
  if (isImportErrorCode(message)) return message;
  return IMPORT_PROVIDER_ERROR;
}
