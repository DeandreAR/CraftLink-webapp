import type { OnboardingSocialDraft } from "@/domain/onboarding";
import type { SocialLinkType, VitrineSocialLink } from "@/domain/vitrine";

type SocialField = {
  key: keyof OnboardingSocialDraft;
  type: SocialLinkType;
  label: string;
  prefix?: string;
};

const SOCIAL_FIELDS: SocialField[] = [
  { key: "instagram", type: "instagram", label: "Instagram", prefix: "https://instagram.com/" },
  { key: "facebook", type: "facebook", label: "Facebook", prefix: "https://facebook.com/" },
  { key: "tiktok", type: "tiktok", label: "TikTok", prefix: "https://tiktok.com/@" },
  { key: "threads", type: "threads", label: "Threads", prefix: "https://threads.net/@" },
  { key: "snapchat", type: "snapchat", label: "Snapchat", prefix: "https://snapchat.com/add/" },
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
): VitrineSocialLink[] {
  return SOCIAL_FIELDS.flatMap(({ key, type, label, prefix }) => {
    const href = normalizeHref(social[key], prefix);
    if (!href) return [];
    return [{ id: type, type, label, href }];
  });
}

export const ONBOARDING_SOCIAL_FIELDS = SOCIAL_FIELDS;
