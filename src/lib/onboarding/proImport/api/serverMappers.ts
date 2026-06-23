import type {
  FacebookPageApiResponse,
  GooglePlaceApiResponse,
  InstagramProfileApiResponse,
} from "@/lib/onboarding/proImport/apiTypes";
import { detectMetierFromImport } from "@/lib/onboarding/jobDetection";
import {
  inferCityFromBio,
  inferExperienceYearsFromBio,
} from "@/lib/onboarding/proImport/inferFromInstagramBio";
import {
  parseGoogleIdentifier,
  resolveGoogleBusinessUrl,
} from "@/lib/onboarding/proImport/parseGoogleIdentifier";
import {
  buildInstagramAvatarProxyUrl,
  instagramProfileEmbedUrl,
} from "@/lib/onboarding/proImport/instagramPortfolio";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";

function parseCityFromAddress(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;
  const beforeComma = trimmed.split(",")[0]?.trim() ?? trimmed;
  const withoutPostal = beforeComma.replace(/^\d{5}\s*/, "").trim();
  return withoutPostal || null;
}

function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null;
  return phone.trim();
}

export function mapGoogleResponseToUnified(
  raw: GooglePlaceApiResponse,
  identifier?: string,
): UnifiedImportData {
  const p = raw.place_results;
  let googleBusinessUrl: string | null = null;

  if (identifier) {
    try {
      const parsed = parseGoogleIdentifier(identifier);
      googleBusinessUrl = resolveGoogleBusinessUrl(parsed, raw.place_id ?? null) || null;
    } catch {
      googleBusinessUrl = null;
    }
  } else if (raw.place_id) {
    googleBusinessUrl = resolveGoogleBusinessUrl(
      { kind: "place_id", placeId: raw.place_id },
      raw.place_id,
    );
  }

  const name = p.title?.trim() ?? "";
  const description = p.description?.trim() ?? "";
  const inferredMetierKey = detectMetierFromImport({
    source: "gmb",
    businessName: name,
    category: p.category,
    biographyOrDesc: description,
  });

  return {
    name,
    description,
    avatarUrl: p.thumbnail ?? "",
    phone: normalizePhone(p.phone_number),
    city: parseCityFromAddress(p.address ?? ""),
    rating: p.rating ?? null,
    reviews: p.reviews ?? null,
    googleBusinessUrl,
    importServices: raw.services ?? [],
    inferredMetierKey,
  };
}

export function mapInstagramResponseToUnified(
  raw: InstagramProfileApiResponse,
  username: string,
  _shortcodes: string[] = [],
): UnifiedImportData {
  const body = raw.response.body;
  const bio = body.biography?.trim() ?? "";
  const rawAvatar = body.hd_profile_pic_url_info?.url ?? body.profile_pic_url ?? "";
  const avatarUrl = rawAvatar ? buildInstagramAvatarProxyUrl(rawAvatar) : "";

  const name = body.full_name?.trim() ?? "";
  const inferredMetierKey = detectMetierFromImport({
    source: "instagram",
    businessName: name,
    biographyOrDesc: bio,
  });

  return {
    name,
    description: bio,
    avatarUrl,
    phone: null,
    city: inferCityFromBio(bio) || null,
    rating: null,
    reviews: null,
    instagramUsername: username.replace(/^@/, ""),
    inferredMetierKey,
    experienceYears: inferExperienceYearsFromBio(bio),
    instagramPortfolio: [
      {
        shortcode: "profile",
        embedUrl: instagramProfileEmbedUrl(username),
      },
    ],
    useBrandGradientBanner: true,
  };
}

export function mapFacebookResponseToUnified(
  raw: FacebookPageApiResponse,
): UnifiedImportData {
  const p = raw.page_data;
  const name = p.name?.trim() ?? "";
  const description = p.about?.trim() ?? "";
  const inferredMetierKey = detectMetierFromImport({
    source: "facebook",
    businessName: name,
    biographyOrDesc: description,
  });

  return {
    name,
    description,
    avatarUrl: p.profile_pic ?? "",
    phone: normalizePhone(p.phone),
    city: null,
    rating: null,
    reviews: null,
    inferredMetierKey,
  };
}
