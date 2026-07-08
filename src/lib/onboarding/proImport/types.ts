import type { OnboardingPortfolioItem, OnboardingService, ProImportPlatform } from "@/domain/onboarding";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

/** Données normalisées après mapping des réponses REST. */
export type MappedProImportData = {
  name: string;
  description: string;
  avatarUrl: string;
  phone: string;
  city: string;
  postalCode?: string;
  rating?: number;
  reviews?: number;
  platform: ProImportPlatform;
  identifier: string;
  googleBusinessUrl?: string;
  importServices?: string[];
  services?: OnboardingService[];
  inferredMetierKey?: MetierKey | "";
  experienceYears?: number | null;
  followerCount?: number | null;
  portfolioItems?: OnboardingPortfolioItem[];
  useBrandGradientBanner?: boolean;
};

export type ProImportRunResult = {
  mapped: MappedProImportData;
  brandColor: string;
};
