import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LinkInBioPage } from "@/components/vitrine/LinkInBioPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  buildVitrineNotFoundMetadata,
  buildVitrinePageMetadata,
} from "@/lib/seo/vitrinePageMetadata";
import { fetchPublicVitrinePage } from "@/lib/vitrine/fetchPublicVitrinePage";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Métadonnées dynamiques pour l’URL publique `getcraftlink.com/{username}`.
 * (Rewrite proxy → cette route interne `/v/[slug]`.)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchPublicVitrinePage(slug);
  if (!data) {
    return buildVitrineNotFoundMetadata();
  }

  return buildVitrinePageMetadata(data.artisan, data.artisan.slug || slug);
}

export default async function PublicVitrinePage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchPublicVitrinePage(slug);
  if (!data) {
    notFound();
  }

  const dict = await getDictionary(defaultLocale);

  return (
    <LinkInBioPage
      artisan={data.artisan}
      services={data.services}
      planTier={data.planTier}
      theme={data.theme}
      profileSettings={data.profileSettings}
      copy={dict.vitrine}
    />
  );
}
