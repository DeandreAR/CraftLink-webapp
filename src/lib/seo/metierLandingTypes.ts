import type { Locale } from "@/i18n/config";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export type MetierLandingFaqItem = {
  question: string;
  answer: string;
};

export type MetierLandingStep = {
  index: string;
  title: string;
  lead: string;
};

export type MetierLandingLocaleContent = {
  tradeLabel: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  heroPill: string;
  heroLead: string;
  heroHighlight: string;
  painH2: string;
  painLead: string;
  painBullets: string[];
  solutionH2: string;
  solutionLead: string;
  solutionBullets: string[];
  stepsEyebrow: string;
  stepsTitle: string;
  stepsLead: string;
  steps: MetierLandingStep[];
  faqEyebrow: string;
  faqTitle: string;
  faq: MetierLandingFaqItem[];
  ctaTitle: string;
  ctaHighlight: string;
  ctaLead: string;
  ctaButton: string;
};

export type MetierLandingPageEntry = {
  metierKey: MetierKey;
  slugs: Record<Locale, string>;
  content: Record<Locale, MetierLandingLocaleContent>;
};
