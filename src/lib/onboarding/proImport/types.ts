import type { ProImportPlatform } from "@/domain/onboarding";

/** Données normalisées après mapping des réponses REST. */
export type MappedProImportData = {
  name: string;
  description: string;
  avatarUrl: string;
  phone: string;
  city: string;
  rating?: number;
  reviews?: number;
  platform: ProImportPlatform;
  identifier: string;
};

export type ProImportRunResult = {
  mapped: MappedProImportData;
  brandColor: string;
};
