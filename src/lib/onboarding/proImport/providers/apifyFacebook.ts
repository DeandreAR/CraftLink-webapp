import type { FacebookPageApiResponse } from "@/lib/onboarding/proImport/apiTypes";
import { IMPORT_FACEBOOK_NOT_FOUND } from "@/lib/onboarding/proImport/api/constants";
import {
  deepFindFollowerCount,
  extractFollowerCountFromRecord,
} from "@/lib/onboarding/proImport/extractFollowerCount";
import { runApifyActorSyncGetDatasetItems } from "@/lib/onboarding/proImport/providers/apifyClient";

const DEFAULT_ACTOR = "apify/facebook-posts-scraper";

type ApifyFbUser = {
  name?: string;
  profilePic?: string;
  profile_pic?: string;
};

type ApifyFbPost = {
  user?: ApifyFbUser;
  text?: string;
  pageName?: string;
};

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

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

/**
 * Métadonnées de page Facebook via Apify (apify/facebook-posts-scraper).
 * La bio « about » n'est pas fournie par cet actor — on importe nom, avatar et abonnés.
 */
export async function fetchFacebookFromApify(
  identifier: string,
  token: string,
): Promise<FacebookPageApiResponse> {
  const slug = normalizePageSlug(identifier);
  if (!slug) {
    throw new Error(IMPORT_FACEBOOK_NOT_FOUND);
  }

  const pageUrl = `https://www.facebook.com/${slug}/`;
  const actorId = readEnv("APIFY_FACEBOOK_ACTOR", DEFAULT_ACTOR);
  const items = await runApifyActorSyncGetDatasetItems<ApifyFbPost>(
    actorId,
    {
      startUrls: [{ url: pageUrl }],
      resultsLimit: 3,
    },
    token,
  );

  if (!items.length) {
    throw new Error(IMPORT_FACEBOOK_NOT_FOUND);
  }

  const first = items[0];
  const user = first?.user;
  const name = pickString(user?.name, first?.pageName, slug);
  const profile_pic = pickString(user?.profilePic, user?.profile_pic);
  const followers_count =
    extractFollowerCountFromRecord(first as Record<string, unknown>) ??
    deepFindFollowerCount(items);

  if (!name && !profile_pic) {
    throw new Error(IMPORT_FACEBOOK_NOT_FOUND);
  }

  return {
    page_data: {
      name: name || slug,
      about: "",
      profile_pic,
      phone: null,
      followers_count,
    },
  };
}
