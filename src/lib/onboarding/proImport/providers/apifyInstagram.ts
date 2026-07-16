import type { InstagramProfileApiResponse } from "@/lib/onboarding/proImport/apiTypes";
import { IMPORT_INSTAGRAM_NOT_FOUND } from "@/lib/onboarding/proImport/api/constants";
import {
  buildInstagramAvatarProxyUrl,
  extractInstagramShortcodes,
} from "@/lib/onboarding/proImport/instagramPortfolio";
import {
  deepFindFollowerCount,
  extractFollowerCountFromRecord,
} from "@/lib/onboarding/proImport/extractFollowerCount";
import { runApifyActorSyncGetDatasetItems } from "@/lib/onboarding/proImport/providers/apifyClient";

const DEFAULT_POSTS_ACTOR = "sones/instagram-posts-scraper-lowcost";
const DEFAULT_FOLLOWERS_ACTOR = "apify/instagram-followers-count-scraper";
const POSTS_PER_PROFILE = 12;

export type InstagramPostMedia = {
  shortcode: string;
  imageUrl: string;
};

export type InstagramImportBundle = {
  profile: InstagramProfileApiResponse;
  posts: InstagramPostMedia[];
  followerCount: number | null;
};

type ApifyIgUser = {
  username?: string;
  full_name?: string;
  biography?: string;
  profile_pic_url?: string;
  follower_count?: number;
  followersCount?: number;
  followers?: number;
  edge_followed_by?: { count?: number };
};

type ApifyIgPost = {
  code?: string;
  displayUrl?: string;
  display_url?: string;
  imageUrl?: string;
  image_url?: string;
  thumbnailUrl?: string;
  thumbnail_src?: string;
  user?: ApifyIgUser;
  caption?: { text?: string };
};

function pickPostImageUrl(post: ApifyIgPost): string {
  return pickString(
    post.displayUrl,
    post.display_url,
    post.imageUrl,
    post.image_url,
    post.thumbnailUrl,
    post.thumbnail_src,
  );
}

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function pickUserFromPosts(items: ApifyIgPost[]): ApifyIgUser | null {
  for (const item of items) {
    if (item.user && typeof item.user === "object") {
      return item.user;
    }
  }
  return null;
}

function deepFindBiography(node: unknown, depth = 0): string {
  if (depth > 10 || !node || typeof node !== "object") return "";

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = deepFindBiography(item, depth + 1);
      if (found) return found;
    }
    return "";
  }

  const record = node as Record<string, unknown>;
  const bio = pickString(record.biography, record.bio);
  if (bio) return bio;

  for (const value of Object.values(record)) {
    const found = deepFindBiography(value, depth + 1);
    if (found) return found;
  }

  return "";
}

/**
 * Profil + derniers posts Instagram via Apify (sones/instagram-posts-scraper-lowcost).
 */
export async function fetchInstagramImportBundle(
  username: string,
  token: string,
): Promise<InstagramImportBundle> {
  const handle = username.trim().replace(/^@/, "");
  if (!handle) {
    throw new Error(IMPORT_INSTAGRAM_NOT_FOUND);
  }

  const postsActor = readEnv("APIFY_INSTAGRAM_ACTOR", DEFAULT_POSTS_ACTOR);
  const followersActor = readEnv("APIFY_INSTAGRAM_FOLLOWERS_ACTOR", DEFAULT_FOLLOWERS_ACTOR);
  const proxyInput = {
    useApifyProxy: true,
    apifyProxyGroups: ["RESIDENTIAL"],
  };

  const [items, profileItems] = await Promise.all([
    runApifyActorSyncGetDatasetItems<ApifyIgPost>(
      postsActor,
      {
        usernames: [handle],
        postsPerProfile: POSTS_PER_PROFILE,
        proxy: proxyInput,
      },
      token,
    ).catch(() => [] as ApifyIgPost[]),
    runApifyActorSyncGetDatasetItems<ApifyIgUser>(
      followersActor,
      { usernames: [handle] },
      token,
    ).catch(() => [] as ApifyIgUser[]),
  ]);

  const posts = items.filter((item) => typeof item?.code === "string");
  const profileMeta = profileItems[0] ?? null;
  const user = pickUserFromPosts(posts) ?? profileMeta;

  if (!user && posts.length === 0) {
    throw new Error(IMPORT_INSTAGRAM_NOT_FOUND);
  }

  const fullName = pickString(user?.full_name, profileMeta?.username, handle);
  const biography =
    pickString(user?.biography) ||
    deepFindBiography(profileItems) ||
    deepFindBiography(items);
  const avatarRaw = pickString(user?.profile_pic_url);
  const followerCount =
    extractFollowerCountFromRecord(user as Record<string, unknown> | null) ??
    extractFollowerCountFromRecord(profileMeta as Record<string, unknown> | null) ??
    deepFindFollowerCount(profileItems) ??
    deepFindFollowerCount(items);
  const shortcodes = extractInstagramShortcodes(posts, POSTS_PER_PROFILE);
  const postMedia: InstagramPostMedia[] = [];

  for (const post of posts) {
    const shortcode = post.code?.trim();
    if (!shortcode) continue;

    const imageRaw = pickPostImageUrl(post);
    if (!imageRaw) continue;

    postMedia.push({
      shortcode,
      imageUrl: buildInstagramAvatarProxyUrl(imageRaw),
    });
    if (postMedia.length >= POSTS_PER_PROFILE) break;
  }

  if (postMedia.length === 0 && shortcodes.length > 0) {
    for (const shortcode of shortcodes.slice(0, POSTS_PER_PROFILE)) {
      postMedia.push({ shortcode, imageUrl: "" });
    }
  }

  const profile: InstagramProfileApiResponse = {
    response: {
      body: {
        full_name: fullName,
        biography,
        profile_pic_url: avatarRaw,
        hd_profile_pic_url_info: { url: avatarRaw },
      },
    },
  };

  if (!fullName && !biography && !avatarRaw && !followerCount) {
    throw new Error(IMPORT_INSTAGRAM_NOT_FOUND);
  }

  return { profile, posts: postMedia, followerCount };
}
