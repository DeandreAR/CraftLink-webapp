import type { OnboardingProfileDraft, ProImportPlatform } from "@/domain/onboarding";

export type SocialNetworkKey =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "threads"
  | "snapchat";

export type SocialFollowerStat = {
  count: number;
  show: boolean;
};

export type OnboardingSocialFollowers = Partial<
  Record<SocialNetworkKey, SocialFollowerStat>
>;

export const SOCIAL_NETWORK_KEYS: SocialNetworkKey[] = [
  "instagram",
  "facebook",
  "tiktok",
  "threads",
  "snapchat",
];

export function isSocialNetworkKey(key: string): key is SocialNetworkKey {
  return SOCIAL_NETWORK_KEYS.includes(key as SocialNetworkKey);
}

export function resolveSocialFollowers(
  profile: Pick<
    OnboardingProfileDraft,
    "socialFollowers" | "importFollowerCount" | "importPlatform"
  >,
): OnboardingSocialFollowers {
  const result: OnboardingSocialFollowers = { ...profile.socialFollowers };

  const count = profile.importFollowerCount;
  const platform = profile.importPlatform;
  if (count != null && count > 0 && (platform === "instagram" || platform === "facebook")) {
    if (!result[platform]?.count) {
      result[platform] = {
        count,
        show: result[platform]?.show ?? true,
      };
    }
  }

  return result;
}

export function followerStatFromImport(
  platform: ProImportPlatform,
  count: number | null | undefined,
): OnboardingSocialFollowers | undefined {
  if (platform !== "instagram" && platform !== "facebook") return undefined;
  if (count == null || count <= 0) return undefined;
  return { [platform]: { count, show: true } };
}

export function patchSocialFollower(
  current: OnboardingSocialFollowers | undefined,
  key: SocialNetworkKey,
  patch: Partial<SocialFollowerStat> | null,
): OnboardingSocialFollowers {
  const next = { ...current };
  if (patch === null) {
    delete next[key];
    return next;
  }
  const prev = next[key];
  next[key] = {
    count: patch.count ?? prev?.count ?? 0,
    show: patch.show ?? prev?.show ?? true,
  };
  return next;
}
