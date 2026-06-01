import type { ProImportPlatform } from "@/domain/onboarding";
import type { ProImportApiPayload } from "@/lib/onboarding/proImport/apiTypes";
import type { MappedProImportData } from "@/lib/onboarding/proImport/types";

function parseCityFromAddress(address: string): string {
  const trimmed = address.trim();
  if (!trimmed) return "";
  const beforeComma = trimmed.split(",")[0]?.trim() ?? trimmed;
  const withoutPostal = beforeComma.replace(/^\d{5}\s*/, "").trim();
  return withoutPostal;
}

function normalizePhone(phone: string | null | undefined): string {
  if (!phone?.trim()) return "";
  return phone.trim();
}

export function mapProImportApiPayload(
  payload: ProImportApiPayload,
  identifier: string,
): MappedProImportData {
  const platform = payload.platform;

  if (payload.platform === "google") {
    const { place_results: p } = payload.data;
    return {
      platform,
      identifier,
      name: p.title?.trim() ?? "",
      description: "",
      avatarUrl: p.thumbnail ?? "",
      phone: normalizePhone(p.phone_number),
      city: parseCityFromAddress(p.address ?? ""),
      rating: p.rating,
      reviews: p.reviews,
    };
  }

  if (payload.platform === "instagram") {
    const body = payload.data.response.body;
    return {
      platform,
      identifier,
      name: body.full_name?.trim() ?? "",
      description: body.biography?.trim() ?? "",
      avatarUrl: body.hd_profile_pic_url_info?.url ?? body.profile_pic_url ?? "",
      phone: "",
      city: "",
    };
  }

  const { page_data: p } = payload.data;
  return {
    platform,
    identifier,
    name: p.name?.trim() ?? "",
    description: p.about?.trim() ?? "",
    avatarUrl: p.profile_pic ?? "",
    phone: normalizePhone(p.phone),
    city: "",
  };
}
