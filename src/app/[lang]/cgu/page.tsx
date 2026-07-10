import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalGenerateMetadata } from "@/app/legal-shared";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { LEGAL_SLUGS } from "@/i18n/legalPaths";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) return {};
  return legalGenerateMetadata(raw, LEGAL_SLUGS.terms);
}

export default async function Page({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  return <LegalPage lang={raw as Locale} slug={LEGAL_SLUGS.terms} />;
}
