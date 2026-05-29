import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { onboardingPath } from "@/lib/auth/paths";

export default function OnboardingRedirectPage() {
  redirect(onboardingPath(defaultLocale));
}
