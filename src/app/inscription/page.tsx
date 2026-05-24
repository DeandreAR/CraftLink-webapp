import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { legacyAuthRedirect } from "@/lib/auth/paths";

export default function InscriptionLegacyPage() {
  redirect(legacyAuthRedirect(defaultLocale, "inscription"));
}
