import type { OnboardingVisualDraft } from "@/domain/onboarding";
import type { VitrineMedia } from "@/domain/vitrine";
import type { HeaderGradientValue } from "@/domain/recommendedProduct";
import { normalizeHeaderLayoutType } from "@/domain/recommendedProduct";

function parseGradientValue(raw: string | null | undefined): HeaderGradientValue | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as { from?: unknown; to?: unknown };
    if (typeof parsed.from === "string" && typeof parsed.to === "string") {
      return { from: parsed.from, to: parsed.to };
    }
  } catch {
    // ignore
  }
  return null;
}

export function serializeGradientValue(from: string, to: string): string {
  return JSON.stringify({ from, to });
}

/**
 * Construit le média header public à partir du draft visual.
 * Priorité headerBgType ; fallback legacy Instagram / bannerPreviewUrl.
 */
export function resolveVitrineHeaderMedia(
  visual: OnboardingVisualDraft,
  options?: { brandPrimary?: string },
): Pick<
  VitrineMedia,
  | "bannerUrl"
  | "bannerGradient"
  | "avatarUrl"
  | "showAvatar"
  | "headerLayoutType"
  | "headerBgType"
  | "headerSolidColor"
  | "headerAvatarBorder"
> {
  const brandPrimary = options?.brandPrimary ?? visual.accentColor;
  const themeBannerFrom = `color-mix(in srgb, ${brandPrimary} 35%, white)`;
  const themeBannerTo = `color-mix(in srgb, ${brandPrimary} 8%, white)`;

  const layout = normalizeHeaderLayoutType(visual.headerLayoutType);
  let bgType = visual.headerBgType;
  if (!bgType) {
    if (visual.useBrandGradientBanner) bgType = "gradient";
    else if (visual.bannerPreviewUrl && layout === "banner_overlay") bgType = "image";
    else bgType = "solid";
  }

  // Layouts pleine page / en-tête coloré : fond uni ou dégradé uniquement
  if (layout !== "banner_overlay" && bgType === "image") {
    bgType = "gradient";
  }

  const avatarUrl = visual.avatarPreviewUrl;
  let bannerUrl: string | null = null;
  let bannerGradient: { from: string; to: string } | null = null;
  let headerSolidColor: string | null = null;

  if (bgType === "image") {
    bannerUrl =
      (visual.headerBgValue?.startsWith("http") ? visual.headerBgValue : null) ||
      visual.bannerPreviewUrl;
  } else if (bgType === "gradient") {
    const custom = parseGradientValue(visual.headerBgValue);
    bannerGradient = custom ?? { from: themeBannerFrom, to: themeBannerTo };
  } else {
    headerSolidColor =
      visual.headerBgValue?.startsWith("#") ? visual.headerBgValue : "#FFFFFF";
  }

  if (visual.useBrandGradientBanner && bgType !== "image" && layout === "banner_overlay") {
    bgType = "gradient";
    bannerGradient = bannerGradient ?? { from: themeBannerFrom, to: themeBannerTo };
    bannerUrl = null;
    headerSolidColor = null;
  }

  const showAvatar =
    layout === "brand_cover" || layout === "page_brand"
      ? false
      : layout === "avatar_cover" || layout === "banner_overlay"
        ? true
        : Boolean(avatarUrl);

  return {
    bannerUrl,
    bannerGradient,
    avatarUrl,
    showAvatar,
    headerLayoutType: layout,
    headerBgType: bgType,
    headerSolidColor,
    headerAvatarBorder: visual.headerAvatarBorder !== false,
  };
}
