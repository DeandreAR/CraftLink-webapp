import "server-only";

import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import { isProUser } from "@/domain/proAccess";
import { profileToEditorState } from "@/domain/vitrinePresentation";
import { fetchRemoteProductOgImage } from "@/lib/affiliate/fetchRemoteProductOgImage";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";
import { createAdminClient } from "@/lib/supabase/admin";

export type ResolvedPublicAffiliateLink = {
  link: OnboardingAffiliateLink;
  businessName: string;
  pageSlug: string;
  /** Image pour OG / Twitter : artisan > produit distant > avatar. */
  previewImageUrl: string | null;
  destinationUrl: string;
};

export async function resolvePublicAffiliateLink(
  slug: string,
  linkId: string,
): Promise<ResolvedPublicAffiliateLink | null> {
  const normalizedSlug = sanitizePageSlugInput(slug);
  const normalizedLinkId = linkId.trim();
  if (!normalizedSlug || !normalizedLinkId) return null;

  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "full_name, page_slug, plan_tier, trial_ends_at, is_subscribed, vitrine_presentation",
    )
    .eq("page_slug", normalizedSlug)
    .maybeSingle();

  if (error || !data) return null;

  const hasProAccess = isProUser({
    is_subscribed: data.is_subscribed,
    trial_ends_at: data.trial_ends_at,
    plan_tier: data.plan_tier,
  });
  if (!hasProAccess) return null;

  const { profileDraft } = profileToEditorState({
    id: "",
    workspace_id: "",
    role: "ADMIN",
    plan_tier: data.plan_tier === "PRO" ? "PRO" : "ALL_SOURCES",
    full_name: data.full_name,
    whatsapp_number: null,
    page_slug: data.page_slug,
    onboarding_completed_at: null,
    vitrine_presentation: data.vitrine_presentation,
    created_at: null,
    updated_at: null,
  });

  const link = (profileDraft.affiliateLinks ?? []).find(
    (item) => item.id === normalizedLinkId,
  );
  if (!link?.url) return null;

  const artisanImage = link.imageUrl?.trim() || null;
  const avatarFallback = profileDraft.visual.avatarPreviewUrl?.trim() || null;
  const productImage = artisanImage
    ? null
    : await fetchRemoteProductOgImage(link.url);

  const previewImageUrl = artisanImage || productImage || avatarFallback;

  return {
    link,
    businessName: profileDraft.businessName.trim() || data.full_name?.trim() || "Artisan",
    pageSlug: normalizedSlug,
    previewImageUrl,
    destinationUrl: link.url,
  };
}
