import { notFound } from "next/navigation";
import { LinkInBioPage } from "@/components/vitrine/LinkInBioPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPublicPagePath } from "@/lib/onboarding/publicPageUrl";
import { buildPageOpenGraph } from "@/lib/seo/siteMetadata";
import { fetchPublicVitrinePage } from "@/lib/vitrine/fetchPublicVitrinePage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchPublicVitrinePage(slug);
  if (!data) {
    return { title: "Page introuvable — CraftLink" };
  }

  const title = `${data.artisan.businessName} — Devis & contact`;
  const description = data.artisan.city
    ? `${data.artisan.tradeLabel} — ${data.artisan.city}`
    : data.artisan.tradeLabel;
  const path = buildPublicPagePath(slug);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({ title, description, path }),
  };
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
