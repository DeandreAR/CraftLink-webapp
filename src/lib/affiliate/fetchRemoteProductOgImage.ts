import "server-only";

/**
 * Extrait og:image / twitter:image depuis une page produit (aperçu affiliation).
 * Best-effort : timeout court, ignore les sites qui bloquent le scraping.
 */
export async function fetchRemoteProductOgImage(
  pageUrl: string,
  options?: { timeoutMs?: number },
): Promise<string | null> {
  const timeoutMs = options?.timeoutMs ?? 2500;
  let parsed: URL;
  try {
    parsed = new URL(pageUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (compatible; CraftLinkBot/1.0; +https://getcraftlink.com)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("xhtml")) {
      return null;
    }

    const html = (await response.text()).slice(0, 250_000);
    const candidates = [
      matchMetaContent(html, "og:image"),
      matchMetaContent(html, "og:image:secure_url"),
      matchMetaContent(html, "twitter:image"),
      matchMetaContent(html, "twitter:image:src"),
    ].filter(Boolean) as string[];

    for (const raw of candidates) {
      const absolute = toAbsoluteUrl(raw, parsed);
      if (absolute) return absolute;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function matchMetaContent(html: string, property: string): string | null {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return null;
}

function toAbsoluteUrl(raw: string, base: URL): string | null {
  try {
    const url = new URL(raw, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
