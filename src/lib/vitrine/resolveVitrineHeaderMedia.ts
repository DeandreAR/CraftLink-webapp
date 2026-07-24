import type { OnboardingVisualDraft } from "@/domain/onboarding";
import type { VitrineMedia } from "@/domain/vitrine";
import type { HeaderGradientValue } from "@/domain/recommendedProduct";

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
> {
  const brandPrimary = options?.brandPrimary ?? visual.accentColor;
  const themeBannerFrom = `color-mix(in srgb, ${brandPrimary} 35%, white)`;
  const themeBannerTo = `color-mix(in srgb, ${brandPrimary} 8%, white)`;

  const layout = visual.headerLayoutType ?? "banner_overlay";
  let bgType = visual.headerBgType;
  if (!bgType) {
    if (visual.useBrandGradientBanner) bgType = "gradient";
    else if (visual.bannerPreviewUrl) bgType = "image";
    else bgType = "solid";
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

  // Legacy Instagram force gradient if flag set and no explicit image preference
  if (visual.useBrandGradientBanner && bgType !== "image") {
    bgType = "gradient";
    bannerGradient = bannerGradient ?? { from: themeBannerFrom, to: themeBannerTo };
    bannerUrl = null;
    headerSolidColor = null;
  }

  return {
    bannerUrl,
    bannerGradient,
    avatarUrl,
    showAvatar: Boolean(avatarUrl) || layout === "banner_overlay",
    headerLayoutType: layout,
    headerBgType: bgType,
    headerSolidColor,
  };
}
