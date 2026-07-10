import type { ProImportPlatform } from "@/domain/onboarding";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";

/** Import « réussi » : l’artisan reçoit au moins le nom + une info exploitable. */
export function isMeaningfulImportResult(
  data: UnifiedImportData,
  platform: ProImportPlatform,
): boolean {
  const name = data.name.trim();
  if (name.length < 2) return false;

  const hasAvatar = Boolean(data.avatarUrl?.trim());
  const hasDesc = Boolean(data.description?.trim());
  const hasFollowers = (data.followerCount ?? 0) > 0;

  if (platform === "google") {
    return Boolean(
      hasAvatar ||
        hasDesc ||
        data.rating != null ||
        data.reviews != null ||
        (data.googlePortfolio?.length ?? 0) > 0 ||
        (data.importServices?.length ?? 0) > 0,
    );
  }

  if (platform === "instagram") {
    return Boolean(
      hasAvatar ||
        hasDesc ||
        hasFollowers ||
        (data.instagramPortfolio?.length ?? 0) > 0,
    );
  }

  if (platform === "facebook") {
    return Boolean(hasAvatar || hasDesc || hasFollowers);
  }

  return true;
}
