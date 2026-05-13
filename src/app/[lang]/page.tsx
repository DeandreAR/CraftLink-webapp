import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHome } from "@/components/landing/LandingHome";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";

type LangPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dict = await getDictionary(raw);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
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
