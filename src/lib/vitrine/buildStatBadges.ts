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
  const googleUrl = profile.social.googleBusinessUrl.trim();
  const hasGoogleBusiness = googleUrl.length > 0;

  if (hasGoogleBusiness) {
    const googleReviews = profile.importGoogleReviewCount;
    const googleRating = profile.importGoogleRating;

    // Une pastille Google : note + étoiles (et compteur d’avis si dispo)
    if (googleRating != null && googleRating > 0) {
      const reviewPart =
        googleReviews != null && googleReviews > 0
          ? locale === "en"
            ? ` · ${googleReviews}+ reviews`
            : ` · ${googleReviews}+ avis`
          : "";
      badges.push({
        id: "google",
        label: `${googleRating}${reviewPart}`,
        kind: "google_rating",
        rating: String(googleRating),
        starCount: 5,
        href: googleUrl,
      });
    } else if (googleReviews != null && googleReviews > 0) {
      badges.push({
        id: "google",
        label:
          locale === "en"
            ? `${googleReviews}+ Google reviews`
            : `${googleReviews}+ avis Google`,
        kind: "google_reviews",
        href: googleUrl,
        starCount: 5,
      });
    } else {
      badges.push({
        id: "google",
        label: locale === "en" ? "Google reviews" : "Avis Google",
        kind: "google_reviews",
        href: googleUrl,
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
