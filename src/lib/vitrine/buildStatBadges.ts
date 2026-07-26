import type { OnboardingProfileDraft } from "@/domain/onboarding";
import type { VitrineStatBadge } from "@/domain/vitrine";
import type { Locale } from "@/i18n/config";
import {
  formatCompletedProjectsBadge,
  formatExperienceYearsBadge,
  resolvePublicExperienceYears,
} from "@/lib/vitrine/profileStatLabels";

/** Badges affichés sous le hero vitrine (avis Google, expérience, réalisations). */
export function buildStatBadges(
  profile: OnboardingProfileDraft,
  _vitrineCopy: unknown,
  locale: Locale,
): VitrineStatBadge[] {
  const badges: VitrineStatBadge[] = [];
  const hasGoogleBusiness = profile.social.googleBusinessUrl.trim().length > 0;

  if (hasGoogleBusiness) {
    const googleReviews = profile.importGoogleReviewCount;
    const googleRating = profile.importGoogleRating;

    if (googleReviews != null && googleReviews > 0) {
      badges.push({
        id: "reviews",
        label: locale === "en" ? `${googleReviews}+ Google reviews` : `${googleReviews}+ avis Google`,
        kind: "google_reviews",
      });
    }

    if (googleRating != null && googleRating > 0) {
      badges.push({
        id: "rating",
        label: String(googleRating),
        kind: "google_rating",
        rating: String(googleRating),
        starCount: 5,
      });
    }
  }

  const experienceYears = resolvePublicExperienceYears(
    profile.experienceYears,
    profile.importExperienceYears,
  );
  if (experienceYears != null) {
    badges.push({
      id: "experience",
      label: formatExperienceYearsBadge(experienceYears, locale),
      kind: "experience",
    });
  }

  const projectsCount = profile.completedProjectsCount;
  if (typeof projectsCount === "number" && projectsCount > 0) {
    badges.push({
      id: "projects",
      label: formatCompletedProjectsBadge(projectsCount, locale),
      kind: "projects",
    });
  }

  return badges;
}
