import type { OnboardingPortfolioItem } from "@/domain/onboarding";

const MAX_PORTFOLIO_POSTS = 6;

export function instagramEmbedUrl(shortcode: string): string {
  return `https://www.instagram.com/p/${shortcode}/embed`;
}

export function extractInstagramShortcodes(payload: unknown, limit = MAX_PORTFOLIO_POSTS): string[] {
  const found: string[] = [];

  const visit = (node: unknown): void => {
    if (found.length >= limit) return;
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }

    const record = node as Record<string, unknown>;
    const code = record.code ?? record.shortcode;
    if (typeof code === "string" && /^[A-Za-z0-9_-]{5,20}$/.test(code)) {
      found.push(code);
    }

    for (const value of Object.values(record)) {
      visit(value);
      if (found.length >= limit) break;
    }
  };

  visit(payload);
  return [...new Set(found)].slice(0, limit);
}

export function shortcodesToPortfolioItems(shortcodes: string[]): OnboardingPortfolioItem[] {
  return shortcodes.map((shortcode) => ({
    id: `ig-${shortcode}`,
    type: "instagram_embed" as const,
    embedUrl: instagramEmbedUrl(shortcode),
    alt: `Publication Instagram ${shortcode}`,
  }));
}

export function buildInstagramAvatarProxyUrl(rawUrl: string): string {
  return `/api/import/instagram/avatar?url=${encodeURIComponent(rawUrl)}`;
}
