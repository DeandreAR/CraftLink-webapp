import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetierLandingPage } from "@/components/landing/metiers/MetierLandingPage";
import { defaultLocale } from "@/i18n/config";
import { buildPageOpenGraph } from "@/lib/seo/siteMetadata";
import {
  getMetierLandingPage,
  METIER_LANDING_PAGES,
  metierLandingPath,
} from "@/lib/seo/metierLandingPages";

type MetierPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return METIER_LANDING_PAGES.map((page) => ({ slug: page.slugs.fr }));
}

export async function generateMetadata({ params }: MetierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getMetierLandingPage(slug, defaultLocale);
  if (!entry) return {};

  const content = entry.content[defaultLocale];
  const path = metierLandingPath(entry, defaultLocale);

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: {
      canonical: path,
      languages: {
        fr: metierLandingPath(entry, "fr"),
        en: metierLandingPath(entry, "en"),
      },
    },
    openGraph: buildPageOpenGraph({
      title: content.seoTitle,
      description: content.seoDescription,
      path,
    }),
  };
}

export default async function MetierLandingRoute({ params }: MetierPageProps) {
  const { slug } = await params;
  const entry = getMetierLandingPage(slug, defaultLocale);
  if (!entry) notFound();

  return <MetierLandingPage lang={defaultLocale} entry={entry} />;
}
