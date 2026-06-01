import type {
  FacebookPageApiResponse,
  GooglePlaceApiResponse,
  InstagramProfileApiResponse,
} from "@/lib/onboarding/proImport/apiTypes";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";
import {
  inferCityFromBio,
  inferExperienceYearsFromBio,
  inferMetierFromBio,
} from "@/lib/onboarding/proImport/inferFromInstagramBio";
import {
  buildInstagramAvatarProxyUrl,
  instagramEmbedUrl,
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
): UnifiedImportData {
  const p = raw.place_results;
  return {
    name: p.title?.trim() ?? "",
    description: "",
    avatarUrl: p.thumbnail ?? "",
    phone: normalizePhone(p.phone_number),
    city: parseCityFromAddress(p.address ?? ""),
    rating: p.rating ?? null,
    reviews: p.reviews ?? null,
  };
}

export function mapInstagramResponseToUnified(
  raw: InstagramProfileApiResponse,
  username: string,
  shortcodes: string[] = [],
): UnifiedImportData {
  const body = raw.response.body;
  const bio = body.biography?.trim() ?? "";
  const rawAvatar = body.hd_profile_pic_url_info?.url ?? body.profile_pic_url ?? "";
  const avatarUrl = rawAvatar ? buildInstagramAvatarProxyUrl(rawAvatar) : "";

  const inferred = inferMetierFromBio(bio);
  const metierKey: MetierKey | "" = inferred && isMetierKey(inferred) ? inferred : "";

  return {
    name: body.full_name?.trim() ?? "",
    description: bio,
    avatarUrl,
    phone: null,
    city: inferCityFromBio(bio) || null,
    rating: null,
    reviews: null,
    instagramUsername: username.replace(/^@/, ""),
    inferredMetierKey: metierKey || null,
    experienceYears: inferExperienceYearsFromBio(bio),
    instagramPortfolio: shortcodes.map((shortcode) => ({
      shortcode,
      embedUrl: instagramEmbedUrl(shortcode),
    })),
    useBrandGradientBanner: true,
  };
}

export function mapFacebookResponseToUnified(
  raw: FacebookPageApiResponse,
): UnifiedImportData {
  const p = raw.page_data;
  return {
    name: p.name?.trim() ?? "",
    description: p.about?.trim() ?? "",
    avatarUrl: p.profile_pic ?? "",
    phone: normalizePhone(p.phone),
    city: null,
    rating: null,
    reviews: null,
  };
}
