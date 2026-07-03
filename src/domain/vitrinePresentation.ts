import type {
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
  visual: OnboardingVisualDraft;
  portfolioItems?: OnboardingPortfolioItem[];
  importPlatform?: ProImportPlatform;
  importGoogleRating?: number;
  importGoogleReviewCount?: number;
  importExperienceYears?: number;
};

export type StoredVitrineConfig = {
  version: 1;
  profile: StoredVitrineProfilePart;
  services: OnboardingService[];
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
  return {
    fontId: (typeof row.fontId === "string" ? row.fontId : base.fontId) as OnboardingVisualDraft["fontId"],
    accentColor: typeof row.accentColor === "string" ? row.accentColor : base.accentColor,
    avatarPreviewUrl:
      typeof row.avatarPreviewUrl === "string" ? row.avatarPreviewUrl : row.avatarPreviewUrl === null ? null : base.avatarPreviewUrl,
    bannerPreviewUrl:
      typeof row.bannerPreviewUrl === "string" ? row.bannerPreviewUrl : row.bannerPreviewUrl === null ? null : base.bannerPreviewUrl,
    useBrandGradientBanner: row.useBrandGradientBanner === true,
  };
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
    visual: parseVisual(row.visual),
    portfolioItems: Array.isArray(row.portfolioItems)
      ? (row.portfolioItems as OnboardingPortfolioItem[])
      : [],
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

  return {
    version: 1,
    profile: parseProfilePart(row.profile),
    services,
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
    visual: config.profile.visual,
    portfolioItems: config.profile.portfolioItems,
    importPlatform: config.profile.importPlatform,
    importGoogleRating: config.profile.importGoogleRating,
    importGoogleReviewCount: config.profile.importGoogleReviewCount,
    importExperienceYears: config.profile.importExperienceYears,
  };

  return { profileDraft, services: config.services };
}

export function editorStateToStoredConfig(
  profileDraft: OnboardingProfileDraft,
  services: OnboardingService[],
): StoredVitrineConfig {
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
      visual: profileDraft.visual,
      portfolioItems: profileDraft.portfolioItems,
      importPlatform: profileDraft.importPlatform,
      importGoogleRating: profileDraft.importGoogleRating,
      importGoogleReviewCount: profileDraft.importGoogleReviewCount,
      importExperienceYears: profileDraft.importExperienceYears,
    },
    services,
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
