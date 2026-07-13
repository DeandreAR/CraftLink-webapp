import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetierLandingPage } from "@/components/landing/metiers/MetierLandingPage";
import { isLocale, type Locale } from "@/i18n/config";
import { buildPageOpenGraph } from "@/lib/seo/siteMetadata";
import {
  getMetierLandingPage,
  METIER_LANDING_PAGES,
  metierLandingPath,
} from "@/lib/seo/metierLandingPages";

type LangMetierPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  return METIER_LANDING_PAGES.map((page) => ({
    lang: "en" as const,
    slug: page.slugs.en,
  }));
}

export async function generateMetadata({ params }: LangMetierPageProps): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  if (!isLocale(raw)) return {};

  const lang = raw as Locale;
  const entry = getMetierLandingPage(slug, lang);
  if (!entry) return {};

  const content = entry.content[lang];
  const path = metierLandingPath(entry, lang);

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

export default async function LangMetierLandingRoute({ params }: LangMetierPageProps) {
  const { lang: raw, slug } = await params;
  if (!isLocale(raw)) notFound();

  const lang = raw as Locale;
  const entry = getMetierLandingPage(slug, lang);
  if (!entry) notFound();

  return <MetierLandingPage lang={lang} entry={entry} />;
}
