import type { FacebookPageApiResponse } from "@/lib/onboarding/proImport/apiTypes";
import { providerFetch } from "@/lib/onboarding/proImport/api/providerHttp";
import { throwIfQuotaHttpStatus } from "@/lib/onboarding/proImport/api/providerErrors";

function normalizePageSlug(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes("facebook.com")) {
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      const segment = url.pathname.split("/").filter(Boolean)[0];
      return segment ?? trimmed;
    } catch {
      return trimmed.replace(/^@/, "");
    }
  }
  return trimmed.replace(/^@/, "");
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function extractPageFromUnknown(data: unknown): FacebookPageApiResponse["page_data"] | null {
  if (!data || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;

  const candidates: Record<string, unknown>[] = [
    root,
    root.page_data as Record<string, unknown>,
    root.data as Record<string, unknown>,
    (root.result as Record<string, unknown>) ?? {},
    Array.isArray(root.results) ? (root.results[0] as Record<string, unknown>) : {},
    Array.isArray(root.pages) ? (root.pages[0] as Record<string, unknown>) : {},
    Array.isArray(root.data) ? (root.data[0] as Record<string, unknown>) : {},
  ].filter((c) => Object.keys(c).length > 0);

  for (const item of candidates) {
    const name = pickString(item.name, item.pageName, item.title, item.page_name);
    const about = pickString(item.about, item.description, item.bio, item.intro);
    const profile_pic = pickString(
      item.profile_pic,
      item.profilePictureUrl,
      item.profile_pic_url,
      item.profilePicUrl,
      item.image,
    );
    const phone = pickString(item.phone, item.phone_number, item.phoneNumber);

    if (name || about || profile_pic) {
      return {
        name,
        about,
        profile_pic,
        phone: phone || null,
      };
    }
  }

  return null;
}

/**
 * Page Facebook via RapidAPI (hôte configurable).
 * Définir RAPIDAPI_FACEBOOK_HOST et RAPIDAPI_FACEBOOK_PATH selon votre abonnement RapidAPI.
 * Ex. facebook-pages-scraper2 : POST /pages avec { "pages": ["https://www.facebook.com/slug"] }
 */
export async function fetchFacebookFromRapidApi(
  identifier: string,
  apiKey: string,
  host: string,
  path: string,
): Promise<FacebookPageApiResponse> {
  const slug = normalizePageSlug(identifier);
  if (!slug) {
    throw new Error("Identifiant de page Facebook requis");
  }

  const pageUrl = `https://www.facebook.com/${slug}`;
  const url = `https://${host}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await providerFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": host,
      Accept: "application/json",
    },
    body: JSON.stringify({
      pages: [pageUrl],
      page_url: pageUrl,
      url: pageUrl,
      username: slug,
    }),
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throwIfQuotaHttpStatus(response.status, text);
    throw new Error(`RapidAPI Facebook HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  const data: unknown = JSON.parse(text);
  const page = extractPageFromUnknown(data);

  if (!page?.name) {
    throw new Error(
      "Page Facebook introuvable. Vérifiez RAPIDAPI_FACEBOOK_HOST / RAPIDAPI_FACEBOOK_PATH.",
    );
  }

  return { page_data: page };
}
