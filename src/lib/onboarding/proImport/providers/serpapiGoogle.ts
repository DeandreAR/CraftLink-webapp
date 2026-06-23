import type { GooglePlaceApiResponse } from "@/lib/onboarding/proImport/apiTypes";
import {
  extractGooglePlaceServices,
  type SerpPlaceWithServices,
} from "@/lib/onboarding/proImport/googlePlaceServices";
import { parseGoogleIdentifier } from "@/lib/onboarding/proImport/parseGoogleIdentifier";
import { providerFetch } from "@/lib/onboarding/proImport/api/providerHttp";
import {
  throwIfQuotaHttpStatus,
  throwIfQuotaInProviderError,
} from "@/lib/onboarding/proImport/api/providerErrors";

type SerpPlace = SerpPlaceWithServices & {
  title?: string;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  address?: string;
  phone?: string;
  description?: string;
  images?: { thumbnail?: string }[];
  place_id?: string;
  data_id?: string;
  data_cid?: string;
  gps_coordinates?: { latitude?: number; longitude?: number };
};

type SerpMapsResponse = {
  error?: string;
  place_results?: SerpPlace;
  local_results?: SerpPlace[];
};

function mergePlaces(base: SerpPlace, patch?: SerpPlace): SerpPlace {
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    menu: patch.menu ?? base.menu,
    services: patch.services ?? base.services,
    offerings: patch.offerings ?? base.offerings,
    extensions: patch.extensions ?? base.extensions,
    unsupported_extensions: patch.unsupported_extensions ?? base.unsupported_extensions,
  };
}

function buildPlaceDataParam(place: SerpPlace): string | null {
  const dataId = place.data_id?.trim();
  const lat = place.gps_coordinates?.latitude;
  const lng = place.gps_coordinates?.longitude;
  if (!dataId || lat == null || lng == null) return null;
  return `!4m5!3m4!1s${dataId}!8m2!3d${lat}!4d${lng}`;
}

function toGooglePayload(place: SerpPlace, placeId?: string): GooglePlaceApiResponse {
  const resolvedPlaceId = placeId ?? place.place_id;
  const services = extractGooglePlaceServices(place);
  return {
    place_results: {
      title: place.title ?? "",
      rating: place.rating ?? 0,
      reviews: place.reviews ?? 0,
      thumbnail: place.thumbnail ?? place.images?.[0]?.thumbnail ?? "",
      address: place.address ?? "",
      phone_number: place.phone ?? null,
      description: place.description?.trim() ?? "",
    },
    ...(resolvedPlaceId ? { place_id: resolvedPlaceId } : {}),
    ...(services.length > 0 ? { services } : {}),
  };
}

async function serpMapsSearch(
  apiKey: string,
  params: Record<string, string>,
): Promise<SerpMapsResponse> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("api_key", apiKey);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await providerFetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throwIfQuotaHttpStatus(response.status, text);
    throw new Error(`SerpApi HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = JSON.parse(text) as SerpMapsResponse;
  if (data.error) {
    throwIfQuotaInProviderError(data.error);
    throw new Error(data.error);
  }
  return data;
}

async function enrichPlaceDetails(
  apiKey: string,
  place: SerpPlace,
  placeId?: string,
  options?: { skipPlaceIdFetch?: boolean },
): Promise<SerpPlace> {
  let merged = place;
  const resolvedPlaceId = placeId ?? place.place_id;

  if (
    !options?.skipPlaceIdFetch &&
    resolvedPlaceId &&
    extractGooglePlaceServices(merged).length === 0
  ) {
    const byPlaceId = await serpMapsSearch(apiKey, {
      engine: "google_maps",
      place_id: resolvedPlaceId,
      hl: "fr",
      gl: "fr",
    });
    if (byPlaceId.place_results?.title) {
      merged = mergePlaces(merged, byPlaceId.place_results);
    }
  }

  if (extractGooglePlaceServices(merged).length > 0) {
    return merged;
  }

  const dataParam = buildPlaceDataParam(merged);
  if (dataParam) {
    const byData = await serpMapsSearch(apiKey, {
      engine: "google_maps",
      type: "place",
      data: dataParam,
      hl: "fr",
      gl: "fr",
    });
    if (byData.place_results?.title) {
      merged = mergePlaces(merged, byData.place_results);
    }
  }

  if (extractGooglePlaceServices(merged).length > 0 || !merged.data_cid) {
    return merged;
  }

  const byCid = await serpMapsSearch(apiKey, {
    engine: "google_maps",
    data_cid: merged.data_cid,
    hl: "fr",
    gl: "fr",
  });
  if (byCid.place_results?.title) {
    merged = mergePlaces(merged, byCid.place_results);
  }

  return merged;
}

async function fetchByPlaceId(
  apiKey: string,
  placeId: string,
): Promise<GooglePlaceApiResponse> {
  const details = await serpMapsSearch(apiKey, {
    engine: "google_maps",
    place_id: placeId,
    hl: "fr",
    gl: "fr",
  });

  if (!details.place_results?.title) {
    throw new Error("Aucune fiche Google My Business trouvée pour cet identifiant.");
  }

  const enriched = await enrichPlaceDetails(apiKey, details.place_results, placeId, {
    skipPlaceIdFetch: true,
  });
  return toGooglePayload(enriched, placeId);
}

async function fetchBySearchQuery(
  apiKey: string,
  query: string,
): Promise<GooglePlaceApiResponse> {
  const search = await serpMapsSearch(apiKey, {
    engine: "google_maps",
    q: query,
    hl: "fr",
    gl: "fr",
    type: "search",
  });

  if (search.place_results?.title) {
    const enriched = await enrichPlaceDetails(apiKey, search.place_results);
    return toGooglePayload(enriched);
  }

  const first = search.local_results?.[0];
  if (!first?.title) {
    throw new Error("Aucune fiche Google My Business trouvée pour cette recherche.");
  }

  const placeId = first.place_id;
  const enriched = await enrichPlaceDetails(apiKey, first, placeId);
  return toGooglePayload(enriched, placeId);
}

/**
 * Google My Business via SerpApi (engine=google_maps).
 * Accepte nom + ville, lien Google Maps / g.page, ou place_id.
 * @see https://serpapi.com/google-maps-api
 */
export async function fetchGoogleFromSerpApi(
  identifier: string,
  apiKey: string,
): Promise<GooglePlaceApiResponse> {
  const parsed = parseGoogleIdentifier(identifier);

  if (parsed.kind === "place_id") {
    return fetchByPlaceId(apiKey, parsed.placeId);
  }

  const query = parsed.kind === "url" ? parsed.url : parsed.query;
  return fetchBySearchQuery(apiKey, query);
}
