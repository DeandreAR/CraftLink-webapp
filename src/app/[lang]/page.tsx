import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHome } from "@/components/landing/LandingHome";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildPageOpenGraph } from "@/lib/seo/siteMetadata";

type LangPageProps = {
  params: Promise<{ lang: string }>;
};

/** ISR — landing localisée. */
export const revalidate = 600;

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dict = await getDictionary(raw);
  const path = `/${raw}`;
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      title: dict.meta.title,
      description: dict.meta.description,
      path,
    }),
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangPage({ params }: LangPageProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const lang = raw as Locale;
  return <LandingHome lang={lang} />;
}
