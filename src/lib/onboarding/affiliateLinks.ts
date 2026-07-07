import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import type { VitrineAffiliateLink } from "@/domain/vitrine";

export const MAX_AFFILIATE_LINKS = 12;

export function normalizeAffiliateUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function createAffiliateLink(): OnboardingAffiliateLink {
  return {
    id: crypto.randomUUID(),
    label: "",
    url: "",
  };
}

export function sanitizeAffiliateLinks(
  links: OnboardingAffiliateLink[],
): OnboardingAffiliateLink[] {
  return links
    .map((link) => ({
      ...link,
      label: link.label.trim(),
      url: normalizeAffiliateUrl(link.url),
    }))
    .filter((link) => link.label.length > 0 && link.url.length > 0)
    .slice(0, MAX_AFFILIATE_LINKS);
}

export function onboardingAffiliateToVitrineLinks(
  links: OnboardingAffiliateLink[],
): VitrineAffiliateLink[] {
  return sanitizeAffiliateLinks(links).map((link) => ({
    id: link.id,
    label: link.label,
    href: link.url,
  }));
}
