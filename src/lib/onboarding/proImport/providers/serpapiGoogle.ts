import type { GooglePlaceApiResponse } from "@/lib/onboarding/proImport/apiTypes";
import { providerFetch } from "@/lib/onboarding/proImport/api/providerHttp";
import {
  throwIfQuotaHttpStatus,
  throwIfQuotaInProviderError,
} from "@/lib/onboarding/proImport/api/providerErrors";

type SerpPlace = {
  title?: string;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  address?: string;
  phone?: string;
  images?: { thumbnail?: string }[];
};

type SerpMapsResponse = {
  error?: string;
  place_results?: SerpPlace;
  local_results?: SerpPlace[];
};

function toGooglePayload(place: SerpPlace): GooglePlaceApiResponse {
  return {
    place_results: {
      title: place.title ?? "",
      rating: place.rating ?? 0,
      reviews: place.reviews ?? 0,
      thumbnail: place.thumbnail ?? place.images?.[0]?.thumbnail ?? "",
      address: place.address ?? "",
      phone_number: place.phone ?? null,
    },
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

/**
 * Google My Business via SerpApi (engine=google_maps).
 * @see https://serpapi.com/google-maps-api
 */
export async function fetchGoogleFromSerpApi(
  identifier: string,
  apiKey: string,
): Promise<GooglePlaceApiResponse> {
  const query = identifier.trim();
  if (!query) {
    throw new Error("Identifiant Google requis");
  }

  const search = await serpMapsSearch(apiKey, {
    engine: "google_maps",
    q: query,
    hl: "fr",
    gl: "fr",
    type: "search",
  });

  if (search.place_results?.title) {
    return toGooglePayload(search.place_results);
  }

  const first = search.local_results?.[0];
  if (!first?.title) {
    throw new Error("Aucune fiche Google My Business trouvée pour cette recherche.");
  }

  const placeId = (first as SerpPlace & { place_id?: string }).place_id;
  if (placeId) {
    const details = await serpMapsSearch(apiKey, {
      engine: "google_maps",
      place_id: placeId,
      hl: "fr",
      gl: "fr",
    });
    if (details.place_results?.title) {
      return toGooglePayload(details.place_results);
    }
  }

  return toGooglePayload(first);
}
