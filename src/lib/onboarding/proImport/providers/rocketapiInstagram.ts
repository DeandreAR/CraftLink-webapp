import type { InstagramProfileApiResponse } from "@/lib/onboarding/proImport/apiTypes";
import { extractInstagramShortcodes } from "@/lib/onboarding/proImport/instagramPortfolio";
import { providerFetch } from "@/lib/onboarding/proImport/api/providerHttp";
import { throwIfQuotaHttpStatus } from "@/lib/onboarding/proImport/api/providerErrors";

type RocketUser = {
  full_name?: string;
  biography?: string;
  profile_pic_url?: string;
  profile_pic_url_hd?: string;
  hd_profile_pic_url_info?: { url?: string };
};

type RocketWebProfileResponse = {
  status?: string;
  response?: {
    status_code?: number;
    body?: {
      data?: {
        user?: RocketUser;
      };
      user?: RocketUser;
    };
  };
};

export type InstagramImportBundle = {
  profile: InstagramProfileApiResponse;
  shortcodes: string[];
};

function normalizeInstagramUrl(url: string | undefined): string {
  if (!url?.trim()) return "";
  return url
    .trim()
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&");
}

function deepFindAvatarUrl(node: unknown, depth = 0): string {
  if (depth > 12 || !node || typeof node !== "object") return "";

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = deepFindAvatarUrl(item, depth + 1);
      if (found) return found;
    }
    return "";
  }

  const record = node as Record<string, unknown>;

  const hdInfo = record.hd_profile_pic_url_info;
  if (hdInfo && typeof hdInfo === "object" && "url" in hdInfo) {
    const url = normalizeInstagramUrl(String((hdInfo as { url?: string }).url ?? ""));
    if (url) return url;
  }

  for (const key of ["profile_pic_url_hd", "profile_pic_url"] as const) {
    if (typeof record[key] === "string") {
      const url = normalizeInstagramUrl(record[key]);
      if (url) return url;
    }
  }

  for (const value of Object.values(record)) {
    const found = deepFindAvatarUrl(value, depth + 1);
    if (found) return found;
  }

  return "";
}

function pickUser(data: RocketWebProfileResponse): RocketUser | null {
  return (
    data.response?.body?.data?.user ??
    data.response?.body?.user ??
    null
  );
}

function pickAvatarUrl(user: RocketUser | null, rawResponse: RocketWebProfileResponse): string {
  const fromUser =
    normalizeInstagramUrl(user?.hd_profile_pic_url_info?.url) ||
    normalizeInstagramUrl(user?.profile_pic_url_hd) ||
    normalizeInstagramUrl(user?.profile_pic_url);

  return fromUser || deepFindAvatarUrl(rawResponse);
}

async function rocketPost<T>(path: string, token: string, body: Record<string, unknown>): Promise<T> {
  const response = await providerFetch(`https://v1.rocketapi.io/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throwIfQuotaHttpStatus(response.status, text);
    throw new Error(`RocketAPI HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  return JSON.parse(text) as T;
}

/**
 * Profil + derniers posts Instagram via RocketAPI.
 */
export async function fetchInstagramImportBundle(
  username: string,
  token: string,
): Promise<InstagramImportBundle> {
  const handle = username.trim().replace(/^@/, "");
  if (!handle) {
    throw new Error("Nom d'utilisateur Instagram requis");
  }

  const profileData = await rocketPost<RocketWebProfileResponse>(
    "instagram/user/get_web_profile_info",
    token,
    { username: handle },
  );

  const user = pickUser(profileData);
  const avatarUrl = pickAvatarUrl(user, profileData);

  if (!user?.full_name && !user?.biography && !avatarUrl) {
    throw new Error("Profil Instagram introuvable ou réponse invalide.");
  }

  let shortcodes: string[] = [];
  try {
    const mediaData = await rocketPost<unknown>(
      "instagram/user/get_media_by_username",
      token,
      { username: handle, count: 6 },
    );
    shortcodes = extractInstagramShortcodes(mediaData, 6);
  } catch {
    shortcodes = extractInstagramShortcodes(profileData, 6);
  }

  const profile: InstagramProfileApiResponse = {
    response: {
      body: {
        full_name: user?.full_name ?? handle,
        biography: user?.biography ?? "",
        profile_pic_url: avatarUrl,
        hd_profile_pic_url_info: { url: avatarUrl },
      },
    },
  };

  return { profile, shortcodes };
}

/** @deprecated Utiliser fetchInstagramImportBundle */
export async function fetchInstagramFromRocketApi(
  username: string,
  token: string,
): Promise<InstagramProfileApiResponse> {
  const bundle = await fetchInstagramImportBundle(username, token);
  return bundle.profile;
}
