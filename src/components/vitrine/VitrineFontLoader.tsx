"use client";

import { useEffect } from "react";
import {
  buildGoogleFontsHref,
  getFontById,
  type OnboardingFontId,
} from "@/lib/onboarding/onboardingFonts";

type VitrineFontLoaderProps = {
  fontId?: string | null;
};

/**
 * Charge la Google Font de la vitrine (page publique + aperçu).
 */
export function VitrineFontLoader({ fontId }: VitrineFontLoaderProps) {
  useEffect(() => {
    if (!fontId) return;
    const id = getFontById(fontId).id as OnboardingFontId;
    const href = buildGoogleFontsHref([id]);
    const existing = document.querySelector(`link[data-vitrine-font="${id}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.vitrineFont = id;
    document.head.appendChild(link);
  }, [fontId]);

  return null;
}
