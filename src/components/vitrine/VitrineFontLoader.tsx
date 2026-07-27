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

function ensurePreconnect(href: string, crossOrigin?: string) {
  const existing = document.querySelector(`link[data-vitrine-preconnect="${href}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = href;
  if (crossOrigin) link.crossOrigin = crossOrigin;
  link.dataset.vitrinePreconnect = href;
  document.head.appendChild(link);
}

/**
 * Charge la Google Font de la vitrine (page publique + aperçu) avec display=swap.
 */
export function VitrineFontLoader({ fontId }: VitrineFontLoaderProps) {
  useEffect(() => {
    if (!fontId) return;
    const id = getFontById(fontId).id as OnboardingFontId;
    const href = buildGoogleFontsHref([id]);
    const existing = document.querySelector(`link[data-vitrine-font="${id}"]`);
    if (existing) return;

    ensurePreconnect("https://fonts.googleapis.com");
    ensurePreconnect("https://fonts.gstatic.com", "anonymous");

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.vitrineFont = id;
    document.head.appendChild(link);
  }, [fontId]);

  return null;
}
