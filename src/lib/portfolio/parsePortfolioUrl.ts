import type { PortfolioSourceType } from "@/domain/portfolio";
import {
  instagramEmbedUrl,
  instagramProfileEmbedUrl,
} from "@/lib/onboarding/proImport/instagramPortfolio";

export type ParsedInstagramUrl =
  | { kind: "profile"; username: string; embedUrl: string; externalUrl: string }
  | { kind: "post"; shortcode: string; embedUrl: string; externalUrl: string };

export function parseInstagramPublicationUrl(raw: string): ParsedInstagramUrl | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  if (host !== "instagram.com") return null;

  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "p" && segments[1]) {
    const shortcode = segments[1];
    return {
      kind: "post",
      shortcode,
      embedUrl: instagramEmbedUrl(shortcode),
      externalUrl: `https://www.instagram.com/p/${shortcode}/`,
    };
  }

  if (segments[0] === "reel" && segments[1]) {
    const shortcode = segments[1];
    return {
      kind: "post",
      shortcode,
      embedUrl: instagramEmbedUrl(shortcode),
      externalUrl: `https://www.instagram.com/reel/${shortcode}/`,
    };
  }

  const username = segments[0]?.replace(/^@/, "");
  if (username && !["explore", "accounts", "stories"].includes(username)) {
    return {
      kind: "profile",
      username,
      embedUrl: instagramProfileEmbedUrl(username),
      externalUrl: `https://www.instagram.com/${username}/`,
    };
  }

  return null;
}

export function parseExternalPortfolioUrl(
  source: Extract<PortfolioSourceType, "facebook" | "google">,
  raw: string,
): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (source === "facebook") {
    const allowed = ["facebook.com", "fb.com", "fb.watch", "m.facebook.com"];
    if (!allowed.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      return null;
    }
    return url.toString();
  }

  const googleHosts = ["google.com", "g.page", "maps.app.goo.gl", "goo.gl"];
  if (!googleHosts.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
    return null;
  }

  return url.toString();
}
