import type { MockVitrinePage } from "@/data/mockVitrine";
import { getMockVitrineBySlug } from "@/data/mockVitrine";
import { parseStoredVitrineConfig } from "@/domain/vitrinePresentation";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";
import { resolvePublicPlanTier } from "@/lib/planTier/publicPlanTier";
import { normalizeCertifications } from "@/lib/profile/normalizeCertifications";
import { listPublicRecommendedProducts } from "@/lib/recommendedProducts/recommendedProductsService";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapStoredConfigToVitrinePage } from "@/lib/vitrine/mapProfileToVitrinePage";

/**
 * Charge une vitrine publique : mocks démo d'abord, puis profil Supabase par `page_slug`.
 */
export async function fetchPublicVitrinePage(slug: string): Promise<MockVitrinePage | null> {
  const normalized = sanitizePageSlugInput(slug);
  if (!normalized) return null;

  const mock = getMockVitrineBySlug(normalized);
  if (mock) return mock;

  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, whatsapp_number, plan_tier, page_slug, voice_capture_enabled, vitrine_presentation, certifications, trial_ends_at, is_subscribed",
    )
    .eq("page_slug", normalized)
    .maybeSingle();

  if (error || !data) return null;

  const planTier = resolvePublicPlanTier({
    plan_tier: data.plan_tier,
    trial_ends_at: data.trial_ends_at,
    is_subscribed: data.is_subscribed === true,
  });
  const config = parseStoredVitrineConfig(data.vitrine_presentation);
  const dict = await getDictionary(defaultLocale);

  const page = mapStoredConfigToVitrinePage(
    {
      full_name: data.full_name,
      whatsapp_number: data.whatsapp_number,
      plan_tier: data.plan_tier,
      page_slug: data.page_slug,
      voice_capture_enabled: data.voice_capture_enabled,
      trial_ends_at: data.trial_ends_at,
      is_subscribed: data.is_subscribed === true,
      certifications: normalizeCertifications(data.certifications),
    },
    config,
    planTier,
    defaultLocale,
    dict.vitrine,
    dict.onboarding,
  );

  if (!page) return null;

  if (planTier === "PRO" && page.profileSettings.visibility.showProSelection) {
    const products = await listPublicRecommendedProducts(String(data.id));
    page.artisan.recommendedProducts = products;
  }

  return page;
}
