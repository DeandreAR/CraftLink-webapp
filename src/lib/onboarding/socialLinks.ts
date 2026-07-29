import type { OnboardingSocialDraft } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { SocialLinkType, VitrineSocialLink } from "@/domain/vitrine";
import type { OnboardingSocialFollowers, SocialNetworkKey } from "@/lib/onboarding/socialFollowers";
import { buildFollowersBadgeLabel } from "@/lib/vitrine/formatFollowerCount";

type SocialField = {
  key: keyof OnboardingSocialDraft;
  networkKey: SocialNetworkKey;
  type: SocialLinkType;
  label: string;
  prefix?: string;
};

const SOCIAL_FIELDS: SocialField[] = [
  {
    key: "instagram",
    networkKey: "instagram",
    type: "instagram",
    label: "Instagram",
    prefix: "https://instagram.com/",
  },
  {
    key: "facebook",
    networkKey: "facebook",
    type: "facebook",
    label: "Facebook",
    prefix: "https://facebook.com/",
  },
  {
    key: "tiktok",
    networkKey: "tiktok",
    type: "tiktok",
    label: "TikTok",
    prefix: "https://tiktok.com/@",
  },
  {
    key: "threads",
    networkKey: "threads",
    type: "threads",
    label: "Threads",
    prefix: "https://threads.net/@",
  },
  {
    key: "snapchat",
    networkKey: "snapchat",
    type: "snapchat",
    label: "Snapchat",
    prefix: "https://snapchat.com/add/",
  },
  {
    key: "youtube",
    networkKey: "youtube",
    type: "youtube",
    label: "YouTube",
    prefix: "https://youtube.com/@",
  },
];

function normalizeHref(raw: string, prefix?: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (prefix) {
    const handle = trimmed.replace(/^@/, "");
    return `${prefix}${handle}`;
  }
  return trimmed;
}

export function onboardingSocialToVitrineLinks(
  social: OnboardingSocialDraft,
  socialFollowers: OnboardingSocialFollowers = {},
  followersLabelTemplate?: string,
  locale: Locale = "fr",
): VitrineSocialLink[] {
  return SOCIAL_FIELDS.flatMap(({ key, networkKey, type, label, prefix }) => {
    const href = normalizeHref(social[key], prefix);
    if (!href) return [];

    const stat = socialFollowers[networkKey];
    const followerLabel =
      stat?.show && stat.count > 0 && followersLabelTemplate
        ? buildFollowersBadgeLabel(stat.count, followersLabelTemplate, locale)
        : undefined;

    return [{ id: type, type, label, href, followerLabel }];
  });
}

export const ONBOARDING_SOCIAL_FIELDS = SOCIAL_FIELDS;
