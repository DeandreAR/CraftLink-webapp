import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import type { VitrineAffiliateLink } from "@/domain/vitrine";
import { buildAppUrl } from "@/config/app";

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
    .map((link) => {
      const imageUrl = link.imageUrl?.trim();
      return {
        ...link,
        label: link.label.trim(),
        url: normalizeAffiliateUrl(link.url),
        discount: link.discount?.trim() || undefined,
        ...(imageUrl ? { imageUrl: normalizeAffiliateUrl(imageUrl) } : {}),
      };
    })
    .filter((link) => link.label.length > 0 && link.url.length > 0)
    .slice(0, MAX_AFFILIATE_LINKS);
}

/** Chemin public partageable : /aff/{slug}/{linkId} */
export function buildAffiliateSharePath(pageSlug: string, linkId: string): string {
  return `/aff/${pageSlug.trim().toLowerCase()}/${linkId.trim()}`;
}

export function buildAffiliateShareAbsoluteUrl(pageSlug: string, linkId: string): string {
  return buildAppUrl(buildAffiliateSharePath(pageSlug, linkId));
}

export function onboardingAffiliateToVitrineLinks(
  links: OnboardingAffiliateLink[],
  options?: { pageSlug?: string | null },
): VitrineAffiliateLink[] {
  const slug = options?.pageSlug?.trim().toLowerCase() || "";

  return sanitizeAffiliateLinks(links).map((link) => ({
    id: link.id,
    label: link.label,
    href: slug ? buildAffiliateSharePath(slug, link.id) : link.url,
    ...(link.discount ? { discount: link.discount } : {}),
    ...(link.imageUrl ? { imageUrl: link.imageUrl } : {}),
  }));
}
