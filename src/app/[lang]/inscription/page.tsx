import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { legacyAuthRedirect } from "@/lib/auth/paths";

type Props = { params: Promise<{ lang: string }> };

export default async function LangInscriptionLegacyPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  redirect(legacyAuthRedirect(raw as Locale, "inscription"));
}
