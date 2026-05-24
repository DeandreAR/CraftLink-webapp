import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { legacyAuthRedirect } from "@/lib/auth/paths";

export default function ConnexionLegacyPage() {
  redirect(legacyAuthRedirect(defaultLocale, "connexion"));
}
