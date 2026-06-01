import type { ProImportPlatform } from "@/domain/onboarding";
import type {
  FacebookPageApiResponse,
  GooglePlaceApiResponse,
  InstagramProfileApiResponse,
  ProImportApiPayload,
} from "@/lib/onboarding/proImport/apiTypes";

const LOGO_GOOGLE = "/images/portfolio/tableau-electrique.png";
const LOGO_INSTA = "/images/portfolio/borne-recharge.png";
const LOGO_FB = "/images/portfolio/electricite-renovation.png";

const IMPORT_DELAY_MS = 2400;

function resolveDisplayName(identifier: string, fallback: string): string {
  const t = identifier.trim().replace(/^@/, "");
  return t.length > 2 ? t : fallback;
}

function buildGoogleResponse(identifier: string): GooglePlaceApiResponse {
  const title = resolveDisplayName(identifier, "John Carter Électricité");
  return {
    place_results: {
      title,
      rating: 4.9,
      reviews: 25,
      thumbnail: LOGO_GOOGLE,
      address: identifier.includes(",")
        ? identifier
        : `${title.includes("Nantes") ? "Nantes" : "Nantes"}, France`,
      phone_number: "+33612345678",
    },
  };
}

function buildInstagramResponse(identifier: string): InstagramProfileApiResponse {
  const handle = identifier.trim().replace(/^@/, "") || "john_electricite";
  const fullName = resolveDisplayName(identifier, "John Carter Électricité");
  return {
    response: {
      body: {
        full_name: fullName,
        biography:
          "Électricien spécialisé à Nantes. Dépannage urgent et installation domotique.",
        profile_pic_url: LOGO_INSTA,
        hd_profile_pic_url_info: { url: LOGO_INSTA },
      },
    },
  };
}

function buildFacebookResponse(identifier: string): FacebookPageApiResponse {
  const name = resolveDisplayName(identifier, "John Carter Électricité");
  return {
    page_data: {
      name,
      about: "Votre artisan de confiance pour vos installations et dépannages.",
      profile_pic: LOGO_FB,
      phone: "+33612345678",
    },
  };
}

/**
 * Simule un appel REST direct vers l’agrégateur (SerpApi / RocketAPI / RapidAPI).
 */
export async function fetchProImportApi(
  platform: ProImportPlatform,
  identifier: string,
): Promise<ProImportApiPayload> {
  await new Promise((resolve) => setTimeout(resolve, IMPORT_DELAY_MS));

  switch (platform) {
    case "google":
      return { platform: "google", data: buildGoogleResponse(identifier) };
    case "instagram":
      return { platform: "instagram", data: buildInstagramResponse(identifier) };
    case "facebook":
      return { platform: "facebook", data: buildFacebookResponse(identifier) };
  }
}
