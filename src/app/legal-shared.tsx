import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { resolveLegalPageFromSlug } from "@/i18n/legalPaths";
export async function legalGenerateMetadata(
  lang: Locale,
  slug: string,
): Promise<Metadata> {
  const pageKey = resolveLegalPageFromSlug(slug);
  if (!pageKey) return {};
  const dict = await getDictionary(lang);
  const page = dict.legal.pages[pageKey];
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

export async function LegalPage({
  lang,
  slug,
}: {
  lang: Locale;
  slug: string;
}) {
  const pageKey = resolveLegalPageFromSlug(slug);
  if (!pageKey) notFound();
  const dict = await getDictionary(lang);
  return <LegalDocumentPage lang={lang} pageKey={pageKey} dict={dict} />;
}
