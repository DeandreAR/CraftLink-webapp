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
  instagramEmbedUrl,
  instagramProfileEmbedUrl,
} from "@/lib/onboarding/proImport/instagramPortfolio";
import { buildGooglePhotoProxyUrl } from "@/lib/onboarding/proImport/googlePhotoProxy";
import { parseGoogleAddress } from "@/lib/onboarding/proImport/parseGoogleAddress";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";
import type { InstagramPostMedia } from "@/lib/onboarding/proImport/providers/apifyInstagram";

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

  const parsedAddress = parseGoogleAddress(p.address ?? "");

  const rawPhotos = raw.googlePhotos?.length
    ? raw.googlePhotos
    : p.thumbnail
      ? [p.thumbnail]
      : [];

  const googlePortfolio = rawPhotos.map((url, index) => ({
    imageUrl: buildGooglePhotoProxyUrl(url),
    title: index === 0 ? "Photo Google" : `Photo Google ${index + 1}`,
  }));

  const avatarSource = rawPhotos[0] ?? p.thumbnail ?? "";

  return {
    name,
    description,
    avatarUrl: avatarSource ? buildGooglePhotoProxyUrl(avatarSource) : "",
    phone: normalizePhone(p.phone_number),
    city: parsedAddress.displayCity,
    postalCode: parsedAddress.postalCode,
    rating: p.rating ?? null,
    reviews: p.reviews ?? null,
    googleBusinessUrl,
    importServices: raw.services ?? [],
    inferredMetierKey,
    googlePortfolio: googlePortfolio.length > 0 ? googlePortfolio : undefined,
  };
}

export function mapInstagramResponseToUnified(
  raw: InstagramProfileApiResponse,
  username: string,
  posts: InstagramPostMedia[] = [],
  followerCount: number | null = null,
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

  const handle = username.replace(/^@/, "");
  const postsWithImages = posts.filter((post) => post.imageUrl.trim());
  const instagramPortfolio: UnifiedImportData["instagramPortfolio"] =
    postsWithImages.length > 0
      ? postsWithImages.map((post) => ({
          shortcode: post.shortcode,
          embedUrl: instagramEmbedUrl(post.shortcode),
          imageUrl: post.imageUrl,
        }))
      : posts.length > 0
        ? posts.map((post) => ({
            shortcode: post.shortcode,
            embedUrl: instagramEmbedUrl(post.shortcode),
          }))
        : [
            {
              shortcode: "profile",
              embedUrl: instagramProfileEmbedUrl(handle),
            },
          ];

  return {
    name,
    description: bio,
    avatarUrl,
    phone: null,
    city: inferCityFromBio(bio) || null,
    rating: null,
    reviews: null,
    instagramUsername: handle,
    inferredMetierKey,
    experienceYears: inferExperienceYearsFromBio(bio),
    followerCount,
    instagramPortfolio,
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
    followerCount: p.followers_count ?? null,
    inferredMetierKey,
  };
}
