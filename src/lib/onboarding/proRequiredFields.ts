import type { OnboardingProfileDraft } from "@/domain/onboarding";

export type ProRequiredFieldKey = "businessName" | "phone" | "city" | "metierKey";

export function getMissingProRequiredFields(
  profile: OnboardingProfileDraft,
): ProRequiredFieldKey[] {
  const missing: ProRequiredFieldKey[] = [];
  if (profile.businessName.trim().length <= 1) missing.push("businessName");
  if (profile.phone.trim().length <= 5) missing.push("phone");
  if (profile.city.trim().length <= 1) missing.push("city");
  if (!profile.metierKey) missing.push("metierKey");
  return missing;
}

export function isProProfilePublishable(profile: OnboardingProfileDraft): boolean {
  return getMissingProRequiredFields(profile).length === 0;
}
