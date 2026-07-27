import type { Metadata } from "next";
import type { ArtisanVitrineProfile } from "@/domain/vitrine";
import { buildAppUrl } from "@/config/app";
import {
  buildPublicPageAbsoluteUrl,
  buildPublicPagePath,
} from "@/lib/onboarding/publicPageUrl";

const SITE_NAME = "CraftLink";
/** Image de partage par défaut (WhatsApp / SMS / réseaux). */
export const DEFAULT_VITRINE_OG_IMAGE_PATH = "/og-default.png";

function resolveZone(artisan: ArtisanVitrineProfile): string {
  return (
    artisan.city?.trim() ||
    artisan.serviceAreaSummary?.trim() ||
    ""
  );
}

/** Avatar → bannière → collage → fallback CraftLink. */
function resolveOgImageUrl(artisan: ArtisanVitrineProfile): string {
  const media = artisan.media;
  if (media.avatarUrl?.startsWith("http")) return media.avatarUrl;
  if (media.bannerUrl?.startsWith("http")) return media.bannerUrl;
  const collage = media.bannerCollage?.find((url) => url?.startsWith("http"));
  if (collage) return collage;
  return buildAppUrl(DEFAULT_VITRINE_OG_IMAGE_PATH);
}

function truncateDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Métadonnées SEO / Open Graph pour `getcraftlink.com/{username}`.
 * Route interne : `app/v/[slug]` (rewrite proxy depuis la racine).
 */
export function buildVitrinePageMetadata(
  artisan: ArtisanVitrineProfile,
  slug: string,
): Metadata {
  const name = artisan.businessName?.trim() || "Artisan";
  const trade = artisan.tradeLabel?.trim() || "Artisan";
  const location = resolveZone(artisan) || "France";
  const path = buildPublicPagePath(slug);
  const canonicalUrl = buildPublicPageAbsoluteUrl(slug);
  const imageUrl = resolveOgImageUrl(artisan);
  const imageAlt = `${name} - ${trade}`;

  const title = `${name} - ${trade} à ${location} | ${SITE_NAME}`;

  const aboutBody = artisan.aboutSection?.body?.trim();
  const description = truncateDescription(
    aboutBody ||
      `Consultez les prestations, la sélection pro et contactez directement ${name} (${trade}) via WhatsApp ou formulaire.`,
  );

  const keywords = [
    trade,
    location,
    name,
    "devis",
    "artisan",
    "WhatsApp",
    "contact",
    artisan.metierKey,
  ].filter((value): value is string => Boolean(value && String(value).trim()));

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildVitrineNotFoundMetadata(): Metadata {
  return {
    title: "Artisan non trouvé | CraftLink",
    robots: { index: false, follow: false },
  };
}
