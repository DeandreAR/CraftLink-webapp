import type {
  OnboardingAffiliateLink,
  OnboardingPartnerBrand,
  OnboardingPortfolioItem,
  OnboardingPresentationMode,
  OnboardingProfileDraft,
  OnboardingService,
  OnboardingSocialDraft,
  OnboardingVisualDraft,
  ProImportPlatform,
} from "@/domain/onboarding";
import {
  defaultOnboardingProfile,
  defaultSocialDraft,
  defaultVisualDraft,
} from "@/domain/onboarding";
import type { Profile } from "@/domain/profile";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import type { OnboardingSocialFollowers } from "@/lib/onboarding/socialFollowers";
import { parsePortfolioItems } from "@/lib/portfolio/normalizePortfolioItem";
import { DEFAULT_PRO_SELECTION_TITLE } from "@/domain/recommendedProduct";

/** Champs vitrine persistés (hors colonnes `profiles`). */
export type StoredVitrineProfilePart = {
  metierKey: MetierKey | "";
  city: string;
  cityCode: string;
  postalCode: string;
  interventionRadiusKm: number;
  presentationMode: OnboardingPresentationMode | null;
  selectedInterventions: string[];
  aboutText: string;
  social: OnboardingSocialDraft;
  affiliateLinks: OnboardingAffiliateLink[];
  partnerBrands: OnboardingPartnerBrand[];
  urgencyCtaEnabled?: boolean;
  proSelectionEnabled?: boolean;
  proSelectionTitle?: string;
  visual: OnboardingVisualDraft;
  portfolioItems?: OnboardingPortfolioItem[];
  importPlatform?: ProImportPlatform;
  importGoogleRating?: number;
  importGoogleReviewCount?: number;
  importExperienceYears?: number;
  experienceYears?: number;
  completedProjectsCount?: number;
  importFollowerCount?: number;
  socialFollowers?: OnboardingSocialFollowers;
  magicImportSuccessCount?: number;
};

export type StoredVitrineConfig = {
  version: 1;
  profile: StoredVitrineProfilePart;
  services: OnboardingService[];
  /** Étape onboarding en cours — pour reprendre après déconnexion / refresh. */
  onboardingProgress?: {
    wizard: "free" | "pro";
    phase: string;
    draftPlan?: "FREE" | "PRO";
  };
};

/** @deprecated Ancien format plat — migré à la lecture. */
export type StoredVitrinePresentation = {
  trade: string;
  description: string;
  city: string;
  instagram: string;
  facebook: string;
  googleBusiness: string;
  accentColor?: string;
};

export const EMPTY_STORED_VITRINE_PROFILE: StoredVitrineProfilePart = {
  metierKey: "",
  city: "",
  cityCode: "",
  postalCode: "",
  interventionRadiusKm: 30,
  presentationMode: null,
  selectedInterventions: [],
  aboutText: "",
  social: defaultSocialDraft(),
  affiliateLinks: [],
  partnerBrands: [],
  visual: defaultVisualDraft(),
  portfolioItems: [],
};

export function emptyStoredVitrineConfig(): StoredVitrineConfig {
  return {
    version: 1,
    profile: { ...EMPTY_STORED_VITRINE_PROFILE, social: defaultSocialDraft(), visual: defaultVisualDraft() },
    services: [],
  };
}

function isLegacyPresentation(raw: Record<string, unknown>): boolean {
  return typeof raw.trade === "string" && raw.version == null;
}

function parseLegacyPresentation(raw: Record<string, unknown>): StoredVitrineConfig {
  const accent = typeof raw.accentColor === "string" ? raw.accentColor.trim() : "";
  const description = typeof raw.description === "string" ? raw.description : "";

  return {
    version: 1,
    profile: {
      ...EMPTY_STORED_VITRINE_PROFILE,
      city: typeof raw.city === "string" ? raw.city : "",
      aboutText: description,
      presentationMode: description ? "about" : null,
      social: {
        ...defaultSocialDraft(),
        instagram: typeof raw.instagram === "string" ? raw.instagram : "",
        facebook: typeof raw.facebook === "string" ? raw.facebook : "",
        googleBusinessUrl: typeof raw.googleBusiness === "string" ? raw.googleBusiness : "",
      },
      visual: {
        ...defaultVisualDraft(),
        ...(accent ? { accentColor: accent } : {}),
      },
    },
    services: [],
  };
}

function parsePartnerBrands(raw: unknown): OnboardingPartnerBrand[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = typeof row.name === "string" ? row.name.trim() : "";
      const id = typeof row.id === "string" && row.id ? row.id : crypto.randomUUID();
      if (!name) return null;
      return { id, name };
    })
    .filter((item): item is OnboardingPartnerBrand => item !== null);
}

function parseAffiliateLinks(raw: unknown): OnboardingAffiliateLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const label = typeof row.label === "string" ? row.label.trim() : "";
      const url = typeof row.url === "string" ? row.url.trim() : "";
      const id = typeof row.id === "string" && row.id ? row.id : crypto.randomUUID();
      const discount =
        typeof row.discount === "string" ? row.discount.trim() : undefined;
      const imageUrl =
        typeof row.imageUrl === "string" ? row.imageUrl.trim() : undefined;
      if (!label || !url) return null;
      return {
        id,
        label,
        url,
        ...(discount ? { discount } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      };
    })
    .filter((item): item is OnboardingAffiliateLink => item !== null);
}

function parseSocial(raw: unknown): OnboardingSocialDraft {
  const base = defaultSocialDraft();
  if (!raw || typeof raw !== "object") return base;
  const row = raw as Record<string, unknown>;
  return {
    instagram: typeof row.instagram === "string" ? row.instagram : base.instagram,
    facebook: typeof row.facebook === "string" ? row.facebook : base.facebook,
    tiktok: typeof row.tiktok === "string" ? row.tiktok : base.tiktok,
    threads: typeof row.threads === "string" ? row.threads : base.threads,
    snapchat: typeof row.snapchat === "string" ? row.snapchat : base.snapchat,
    googleBusinessUrl:
      typeof row.googleBusinessUrl === "string" ? row.googleBusinessUrl : base.googleBusinessUrl,
  };
}

function parseVisual(raw: unknown): OnboardingVisualDraft {
  const base = defaultVisualDraft();
  if (!raw || typeof raw !== "object") return base;
  const row = raw as Record<string, unknown>;

  const headerLayoutType =
    row.headerLayoutType === "standard" || row.headerLayoutType === "banner_overlay"
      ? row.headerLayoutType
      : base.headerLayoutType;

  const headerBgType =
    row.headerBgType === "solid" ||
    row.headerBgType === "gradient" ||
    row.headerBgType === "image"
      ? row.headerBgType
      : base.headerBgType;

  return {
    fontId: (typeof row.fontId === "string" ? row.fontId : base.fontId) as OnboardingVisualDraft["fontId"],
    accentColor: typeof row.accentColor === "string" ? row.accentColor : base.accentColor,
    avatarPreviewUrl:
      typeof row.avatarPreviewUrl === "string"
        ? row.avatarPreviewUrl
        : row.avatarPreviewUrl === null
          ? null
          : base.avatarPreviewUrl,
    bannerPreviewUrl:
      typeof row.bannerPreviewUrl === "string"
        ? row.bannerPreviewUrl
        : row.bannerPreviewUrl === null
          ? null
          : base.bannerPreviewUrl,
    useBrandGradientBanner: row.useBrandGradientBanner === true,
    headerLayoutType,
    headerBgType,
    headerBgValue:
      typeof row.headerBgValue === "string"
        ? row.headerBgValue
        : row.headerBgValue === null
          ? null
          : base.headerBgValue,
  };
}

function parseSocialFollowers(raw: unknown): OnboardingSocialFollowers | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;
  const result: OnboardingSocialFollowers = {};

  for (const key of ["instagram", "facebook", "tiktok", "threads", "snapchat"] as const) {
    const entry = row[key];
    if (!entry || typeof entry !== "object") continue;
    const stat = entry as Record<string, unknown>;
    const count = typeof stat.count === "number" ? Math.max(0, Math.round(stat.count)) : 0;
    if (count <= 0) continue;
    result[key] = {
      count,
      show: stat.show !== false,
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function parseProfilePart(raw: unknown): StoredVitrineProfilePart {
  if (!raw || typeof raw !== "object") {
    return {
      ...EMPTY_STORED_VITRINE_PROFILE,
      social: defaultSocialDraft(),
      visual: defaultVisualDraft(),
    };
  }

  const row = raw as Record<string, unknown>;
  const presentationMode =
    row.presentationMode === "interventions" || row.presentationMode === "about"
      ? row.presentationMode
      : null;

  return {
    metierKey: (typeof row.metierKey === "string" ? row.metierKey : "") as MetierKey | "",
    city: typeof row.city === "string" ? row.city : "",
    cityCode: typeof row.cityCode === "string" ? row.cityCode : "",
    postalCode: typeof row.postalCode === "string" ? row.postalCode : "",
    interventionRadiusKm:
      typeof row.interventionRadiusKm === "number" ? row.interventionRadiusKm : 30,
    presentationMode,
    selectedInterventions: Array.isArray(row.selectedInterventions)
      ? row.selectedInterventions.filter((item): item is string => typeof item === "string")
      : [],
    aboutText: typeof row.aboutText === "string" ? row.aboutText : "",
    social: parseSocial(row.social),
    affiliateLinks: parseAffiliateLinks(row.affiliateLinks),
    partnerBrands: parsePartnerBrands(row.partnerBrands),
    urgencyCtaEnabled:
      typeof row.urgencyCtaEnabled === "boolean" ? row.urgencyCtaEnabled : undefined,
    proSelectionEnabled:
      typeof row.proSelectionEnabled === "boolean" ? row.proSelectionEnabled : true,
    proSelectionTitle:
      typeof row.proSelectionTitle === "string" && row.proSelectionTitle.trim()
        ? row.proSelectionTitle.trim()
        : DEFAULT_PRO_SELECTION_TITLE,
    visual: parseVisual(row.visual),
    portfolioItems: parsePortfolioItems(row.portfolioItems),
    importPlatform:
      row.importPlatform === "google" ||
      row.importPlatform === "instagram" ||
      row.importPlatform === "facebook"
        ? row.importPlatform
        : undefined,
    importGoogleRating:
      typeof row.importGoogleRating === "number" ? row.importGoogleRating : undefined,
    importGoogleReviewCount:
      typeof row.importGoogleReviewCount === "number" ? row.importGoogleReviewCount : undefined,
    importExperienceYears:
      typeof row.importExperienceYears === "number" ? row.importExperienceYears : undefined,
    experienceYears:
      typeof row.experienceYears === "number"
        ? row.experienceYears
        : typeof row.importExperienceYears === "number"
          ? row.importExperienceYears
          : undefined,
    completedProjectsCount:
      typeof row.completedProjectsCount === "number" ? row.completedProjectsCount : undefined,
    importFollowerCount:
      typeof row.importFollowerCount === "number" ? row.importFollowerCount : undefined,
    socialFollowers: parseSocialFollowers(row.socialFollowers),
    magicImportSuccessCount:
      typeof row.magicImportSuccessCount === "number"
        ? Math.max(0, Math.min(3, Math.round(row.magicImportSuccessCount)))
        : undefined,
  };
}

export function parseStoredVitrineConfig(raw: unknown): StoredVitrineConfig {
  if (!raw || typeof raw !== "object") {
    return emptyStoredVitrineConfig();
  }

  const row = raw as Record<string, unknown>;

  if (isLegacyPresentation(row)) {
    return parseLegacyPresentation(row);
  }

  if (row.version !== 1) {
    return emptyStoredVitrineConfig();
  }

  const services = Array.isArray(row.services) ? (row.services as OnboardingService[]) : [];

  const progressRaw = row.onboardingProgress;
  let onboardingProgress: StoredVitrineConfig["onboardingProgress"];
  if (progressRaw && typeof progressRaw === "object") {
    const p = progressRaw as Record<string, unknown>;
    if (
      (p.wizard === "free" || p.wizard === "pro") &&
      typeof p.phase === "string" &&
      p.phase.length > 0
    ) {
      onboardingProgress = {
        wizard: p.wizard,
        phase: p.phase,
        ...(p.draftPlan === "FREE" || p.draftPlan === "PRO"
          ? { draftPlan: p.draftPlan }
          : {}),
      };
    }
  }

  return {
    version: 1,
    profile: parseProfilePart(row.profile),
    services,
    ...(onboardingProgress ? { onboardingProgress } : {}),
  };
}

export function profileToEditorState(profile: Profile): {
  profileDraft: OnboardingProfileDraft;
  services: OnboardingService[];
} {
  const config = parseStoredVitrineConfig(profile.vitrine_presentation);
  const plan = resolveCraftlinkPlan(profile.plan_tier) === "PRO" ? "PRO" : "FREE";
  const base = defaultOnboardingProfile(plan);

  const profileDraft: OnboardingProfileDraft = {
    ...base,
    plan,
    businessName: profile.full_name?.trim() ?? "",
    phone: profile.whatsapp_number?.trim() ?? "",
    pageSlug: profile.page_slug?.trim() ?? "",
    pageSlugConfirmed: Boolean(profile.page_slug?.trim()),
    metierKey: config.profile.metierKey,
    city: config.profile.city,
    cityCode: config.profile.cityCode,
    postalCode: config.profile.postalCode,
    interventionRadiusKm: config.profile.interventionRadiusKm,
    presentationMode: config.profile.presentationMode,
    selectedInterventions: config.profile.selectedInterventions,
    aboutText: config.profile.aboutText,
    social: config.profile.social,
    affiliateLinks: config.profile.affiliateLinks,
    partnerBrands: config.profile.partnerBrands ?? [],
    urgencyCtaEnabled: config.profile.urgencyCtaEnabled,
    proSelectionEnabled: config.profile.proSelectionEnabled ?? true,
    proSelectionTitle:
      config.profile.proSelectionTitle?.trim() || DEFAULT_PRO_SELECTION_TITLE,
    visual: config.profile.visual,
    portfolioItems: config.profile.portfolioItems,
    importPlatform: config.profile.importPlatform,
    importGoogleRating: config.profile.importGoogleRating,
    importGoogleReviewCount: config.profile.importGoogleReviewCount,
    importExperienceYears: config.profile.importExperienceYears,
    experienceYears: config.profile.experienceYears,
    completedProjectsCount: config.profile.completedProjectsCount,
    importFollowerCount: config.profile.importFollowerCount,
    socialFollowers: config.profile.socialFollowers,
    magicImportSuccessCount: config.profile.magicImportSuccessCount,
    aiGenerationsCount:
      typeof profile.ai_generations_count === "number"
        ? profile.ai_generations_count
        : config.profile.magicImportSuccessCount,
  };

  return { profileDraft, services: config.services };
}

export function editorStateToStoredConfig(
  profileDraft: OnboardingProfileDraft,
  services: OnboardingService[],
  onboardingProgress?: StoredVitrineConfig["onboardingProgress"],
): StoredVitrineConfig {
  const visual = { ...profileDraft.visual };
  // Les blob: ne survivent pas à un refresh — on ne les persiste pas.
  if (visual.avatarPreviewUrl?.startsWith("blob:")) visual.avatarPreviewUrl = null;
  if (visual.bannerPreviewUrl?.startsWith("blob:")) visual.bannerPreviewUrl = null;

  return {
    version: 1,
    profile: {
      metierKey: profileDraft.metierKey,
      city: profileDraft.city.trim(),
      cityCode: profileDraft.cityCode,
      postalCode: profileDraft.postalCode,
      interventionRadiusKm: profileDraft.interventionRadiusKm,
      presentationMode: profileDraft.presentationMode,
      selectedInterventions: profileDraft.selectedInterventions,
      aboutText: profileDraft.aboutText.trim(),
      social: profileDraft.social,
      affiliateLinks: profileDraft.affiliateLinks,
      partnerBrands: profileDraft.partnerBrands ?? [],
      urgencyCtaEnabled: profileDraft.urgencyCtaEnabled,
      proSelectionEnabled: profileDraft.proSelectionEnabled ?? true,
      proSelectionTitle:
        profileDraft.proSelectionTitle?.trim() || DEFAULT_PRO_SELECTION_TITLE,
      visual,
      portfolioItems: profileDraft.portfolioItems,
      importPlatform: profileDraft.importPlatform,
      importGoogleRating: profileDraft.importGoogleRating,
      importGoogleReviewCount: profileDraft.importGoogleReviewCount,
      importExperienceYears: profileDraft.importExperienceYears,
      experienceYears: profileDraft.experienceYears,
      completedProjectsCount: profileDraft.completedProjectsCount,
      importFollowerCount: profileDraft.importFollowerCount,
      socialFollowers: profileDraft.socialFollowers,
      magicImportSuccessCount: profileDraft.magicImportSuccessCount,
    },
    services,
    ...(onboardingProgress ? { onboardingProgress } : {}),
  };
}

/** @deprecated Utiliser parseStoredVitrineConfig */
export function parseStoredVitrinePresentation(raw: unknown): StoredVitrinePresentation {
  const config = parseStoredVitrineConfig(raw);
  return {
    trade: "",
    description: config.profile.aboutText,
    city: config.profile.city,
    instagram: config.profile.social.instagram,
    facebook: config.profile.social.facebook,
    googleBusiness: config.profile.social.googleBusinessUrl,
    accentColor: config.profile.visual.accentColor,
  };
}

export function storedVitrineFromDraft(_draft: StoredVitrinePresentation): StoredVitrineConfig {
  return parseLegacyPresentation(_draft as unknown as Record<string, unknown>);
}
