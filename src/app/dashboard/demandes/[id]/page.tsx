import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";

type Props = { params: Promise<{ id: string }> };

/** Deep link notification → onglet inbox avec la demande sélectionnée. */
export default async function DemandeDeepLinkPage({ params }: Props) {
  const { id } = await params;
  const safeId = encodeURIComponent(id.trim());
  redirect(`${authPath(defaultLocale, "dashboard")}?tab=inbox&lead=${safeId}`);
}
