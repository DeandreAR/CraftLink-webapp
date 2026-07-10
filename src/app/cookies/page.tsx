import type { Metadata } from "next";
import { LegalPage, legalGenerateMetadata } from "@/app/legal-shared";
import { defaultLocale } from "@/i18n/config";
import { LEGAL_SLUGS } from "@/i18n/legalPaths";

export async function generateMetadata(): Promise<Metadata> {
  return legalGenerateMetadata(defaultLocale, LEGAL_SLUGS.cookies);
}

export default function Page() {
  return <LegalPage lang={defaultLocale} slug={LEGAL_SLUGS.cookies} />;
}
