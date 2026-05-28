import { notFound } from "next/navigation";
import { LinkInBioPage } from "@/components/vitrine/LinkInBioPage";
import { getMockVitrineBySlug } from "@/data/mockVitrine";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = getMockVitrineBySlug(slug);
  if (!data) {
    return { title: "Page introuvable — CraftLink" };
  }
  return {
    title: `${data.artisan.businessName} — Devis & contact`,
    description: `${data.artisan.tradeLabel} — ${data.artisan.city}`,
  };
}

export default async function PublicVitrinePage({ params }: Props) {
  const { slug } = await params;
  const data = getMockVitrineBySlug(slug);
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
