import "server-only";

import { isReservedAppSlug } from "@/config/reservedSlugs";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";

export type PublishedArtisanSitemapEntry = {
  slug: string;
  lastModified: Date;
};

/**
 * Pages artisans indexables : slug public + onboarding terminé.
 * (Pas de table `pages` — source = `profiles.page_slug`.)
 */
export async function listPublishedArtisanSitemapEntries(): Promise<
  PublishedArtisanSitemapEntry[]
> {
  const supabase = createAdminClient();
  if (!supabase) {
    console.warn("[seo/sitemap] Admin Supabase indisponible — sitemap artisans vide.");
    return [];
  }

  const pageSize = 1000;
  let from = 0;
  const entries: PublishedArtisanSitemapEntry[] = [];
  const seen = new Set<string>();

  while (true) {
    const { data, error } = await supabase
      .from("profiles")
      .select("page_slug, updated_at")
      .not("page_slug", "is", null)
      .not("onboarding_completed_at", "is", null)
      .order("updated_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("[seo/sitemap] profiles select failed:", error.message);
      break;
    }

    if (!data?.length) break;

    for (const row of data) {
      const slug = sanitizePageSlugInput(String(row.page_slug ?? ""));
      if (!slug || isReservedAppSlug(slug) || seen.has(slug)) continue;
      seen.add(slug);
      entries.push({
        slug,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
      });
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return entries;
}
