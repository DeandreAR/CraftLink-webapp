import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";

type Props = {
  params: Promise<{ lang: string; id: string }>;
};

export default async function LangDemandeDeepLinkPage({ params }: Props) {
  const { lang: raw, id } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;
  const safeId = encodeURIComponent(id.trim());
  redirect(`${authPath(lang, "dashboard")}?tab=inbox&lead=${safeId}`);
}
