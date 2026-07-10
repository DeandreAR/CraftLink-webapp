import "server-only";

import { getMockVitrineBySlug } from "@/data/mockVitrine";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_PAGE_SLUGS, validatePageSlug } from "@/lib/onboarding/pageSlug";

export type SlugAvailabilityResult = {
  available: boolean;
  normalized: string;
  validation: ReturnType<typeof validatePageSlug>;
};

export async function checkPageSlugAvailability(
  raw: string,
  excludeUserId?: string,
): Promise<SlugAvailabilityResult> {
  const normalized = raw.trim().toLowerCase();

  if (getMockVitrineBySlug(normalized)) {
    return {
      available: false,
      normalized,
      validation: validatePageSlug(normalized, { taken: true }),
    };
  }

  const validation = validatePageSlug(normalized);
  if (!validation.ok) {
    return { available: false, normalized: validation.normalized, validation };
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("profiles")
      .select("id")
      .eq("page_slug", validation.normalized)
      .limit(1);

    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return {
        available: false,
        normalized: validation.normalized,
        validation: validatePageSlug(validation.normalized, { taken: true }),
      };
    }
  } catch {
    /* Supabase indisponible — on ne bloque que les slugs réservés / démo */
  }

  return {
    available: true,
    normalized: validation.normalized,
    validation,
  };
}
