import type { CSSProperties } from "react";
import type { VitrineMedia } from "@/domain/vitrine";
import {
  normalizeHeaderLayoutType,
  type HeaderLayoutType,
} from "@/domain/recommendedProduct";

/** Layouts où le fond uni/dégradé couvre toute la page. */
export function isFullPageBackgroundLayout(
  layout: HeaderLayoutType | null | undefined,
): boolean {
  const normalized = normalizeHeaderLayoutType(layout);
  return normalized === "avatar_cover" || normalized === "page_brand";
}

export function resolveVitrineCoverStyle(
  media: Pick<VitrineMedia, "bannerGradient" | "bannerUrl" | "headerSolidColor" | "headerBgType">,
): CSSProperties {
  if (media.bannerGradient) {
    return {
      background: `linear-gradient(135deg, ${media.bannerGradient.from} 0%, ${media.bannerGradient.to} 100%)`,
    };
  }
  if (media.bannerUrl) {
    return {
      backgroundImage: `url(${media.bannerUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "local",
    };
  }
  return { backgroundColor: media.headerSolidColor || "#F4F4F4" };
}

export function isLightVitrineCover(
  media: Pick<VitrineMedia, "bannerGradient" | "bannerUrl" | "headerSolidColor">,
): boolean {
  if (media.bannerGradient || media.bannerUrl) return false;
  const hex = media.headerSolidColor?.toUpperCase();
  return hex === "#FFFFFF" || hex === "#F4F4F4" || hex === "#FFF" || hex == null;
}
