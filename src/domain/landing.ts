export type LandingPillarId =
  | "conversion-social"
  | "voice-ai"
  | "lead-scoring"
  | "whatsapp-smart"
  | "export-options"
  | "express-setup";

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

