import type { MetadataRoute } from "next";
import { buildAppUrl, getAppUrl } from "@/config/app";
import { buildPublicPageAbsoluteUrl } from "@/lib/onboarding/publicPageUrl";
import { listPublishedArtisanSitemapEntries } from "@/lib/seo/listPublishedArtisanPages";
import {
  METIER_LANDING_PAGES,
  metierLandingPath,
} from "@/lib/seo/metierLandingPages";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/cgu", changeFrequency: "yearly", priority: 0.2 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { path: "/en", changeFrequency: "weekly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base = getAppUrl();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: entry.path === "/" ? base : buildAppUrl(entry.path),
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const metierEntries: MetadataRoute.Sitemap = METIER_LANDING_PAGES.flatMap(
    (page) =>
      (["fr", "en"] as const).map((lang) => ({
        url: buildAppUrl(metierLandingPath(page, lang)),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
  );

  const artisans = await listPublishedArtisanSitemapEntries();
  const artisanEntries: MetadataRoute.Sitemap = artisans.map((artisan) => ({
    url: buildPublicPageAbsoluteUrl(artisan.slug),
    lastModified: artisan.lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...metierEntries, ...artisanEntries];
}
