import type { StoredVitrineConfig } from "@/domain/vitrinePresentation";
import {
  emptyStoredVitrineConfig,
  parseStoredVitrineConfig,
} from "@/domain/vitrinePresentation";

export const MAX_MAGIC_IMPORT_SUCCESS = 3;

export function readMagicImportSuccessCount(vitrineRaw: unknown): number {
  const config = parseStoredVitrineConfig(vitrineRaw);
  const count = config.profile.magicImportSuccessCount;
  return typeof count === "number" && count > 0 ? Math.min(count, MAX_MAGIC_IMPORT_SUCCESS) : 0;
}

export function magicImportRemaining(vitrineRaw: unknown): number {
  return Math.max(0, MAX_MAGIC_IMPORT_SUCCESS - readMagicImportSuccessCount(vitrineRaw));
}

export function bumpMagicImportSuccessCount(vitrineRaw: unknown): StoredVitrineConfig {
  const config = parseStoredVitrineConfig(vitrineRaw);
  const current = config.profile.magicImportSuccessCount ?? 0;
  return {
    ...config,
    profile: {
      ...config.profile,
      magicImportSuccessCount: Math.min(MAX_MAGIC_IMPORT_SUCCESS, current + 1),
    },
  };
}

export function emptyMagicImportConfig(): StoredVitrineConfig {
  return emptyStoredVitrineConfig();
}
