import type { MockVitrinePage } from "@/data/mockVitrine";
import { getMockVitrineBySlug } from "@/data/mockVitrine";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";
import { normalizePublicPlanTier } from "@/lib/planTier/publicPlanTier";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_VITRINE_THEME } from "@/lib/vitrine/theme";

type ProfileVitrineRow = {
  full_name: string | null;
  plan_tier: string | null;
  page_slug: string | null;
  voice_capture_enabled: boolean | null;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function mapProfileRowToVitrinePage(row: ProfileVitrineRow): MockVitrinePage | null {
  const slug = row.page_slug?.trim();
  if (!slug) return null;

  const businessName = row.full_name?.trim() || "Artisan CraftLink";
  const planTier = normalizePublicPlanTier(row.plan_tier);
  const isPro = planTier === "PRO";

  return {
    planTier,
    theme: DEFAULT_VITRINE_THEME,
    profileSettings: {
      visibility: {
        showSocialLinks: false,
        showStatBadges: false,
        showInterventionTags: false,
        showCollaborationButton: isPro,
        showPortfolioGallery: false,
        showServicesOnPresentation: false,
        contentBlockMode: "about",
      },
      cta: {
        ...(isPro ? { primaryQuote: "Besoin d'un devis rapide ?" } : {}),
        secondaryInfo: "Poser une Question",
        secondaryUrgent: "Demander un RDV Urgent",
        collaboration: "Partenariats & Marques",
      },
      voiceCaptureEnabled: Boolean(row.voice_capture_enabled),
    },
    artisan: {
      slug,
      businessName,
      tradeLabel: "Artisan",
      city: "",
      avatarInitials: initialsFromName(businessName),
      media: {
        showAvatar: false,
        bannerUrl: null,
        avatarUrl: null,
        bannerGradient: {
          from: DEFAULT_VITRINE_THEME.bannerFrom,
          to: DEFAULT_VITRINE_THEME.bannerTo,
        },
      },
      statBadges: [],
      interventions: [],
      serviceAreaSummary: "",
      socialLinks: [],
      aboutSection: {
        title: "À propos",
        body: `Contactez ${businessName} pour votre projet.`,
      },
    },
    services: [],
  };
}

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
    .select("full_name, plan_tier, page_slug, voice_capture_enabled")
    .eq("page_slug", normalized)
    .maybeSingle();

  if (error || !data) return null;

  return mapProfileRowToVitrinePage(data as ProfileVitrineRow);
}
