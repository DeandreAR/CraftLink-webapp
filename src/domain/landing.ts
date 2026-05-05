export type LandingPillarId =
  | "conversion-social"
  | "express-setup"
  | "unique-link"
  | "no-friction";

export type LandingPillar = {
  id: LandingPillarId;
  title: string;
  description: string;
  highlight: string;
};

export type ArtisanPreview = {
  displayName: string;
  craft: string;
  city: string;
  tags: string[];
  about: string;
  stats: Array<{ label: string; value: string }>;
};

