import type {
  ArtisanVitrineProfile,
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineTheme,
} from "@/domain/vitrine";
import { normalizeHeaderLayoutType } from "@/domain/recommendedProduct";
import { resolvePrimaryQuoteLabel } from "@/lib/vitrine/ctaLabels";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineAboutSection } from "@/components/vitrine/VitrineAboutSection";
import { VitrineActionButtons } from "@/components/vitrine/VitrineActionButtons";
import { VitrineCertificationBadges } from "@/components/vitrine/VitrineCertificationBadges";
import { VitrineInterventionTags } from "@/components/vitrine/VitrineInterventionTags";
import { VitrinePortfolioGallery } from "@/components/vitrine/VitrinePortfolioGallery";
import { VitrinePrimaryCtaButton } from "@/components/vitrine/VitrinePrimaryCtaButton";
import { VitrineStatBadges } from "@/components/vitrine/VitrineStatBadges";

type VitrinePresentationProps = {
  artisan: ArtisanVitrineProfile;
  planTier: PublicPlanTier;
  theme: VitrineTheme;
  profileSettings: VitrineProfileSettings;
  copy: VitrineDictionary;
  onOpenDetails: (intent: VitrineOpenIntent) => void;
  identityOnly?: boolean;
  hideIdentity?: boolean;
  /** Page entière sur fond sombre : titres blancs, badges Google lisibles. */
  onDarkCover?: boolean;
};

export function VitrinePresentation({
  artisan,
  planTier,
  theme,
  profileSettings,
  copy,
  onOpenDetails,
  identityOnly = false,
  hideIdentity = false,
  onDarkCover = false,
}: VitrinePresentationProps) {
  const { visibility } = profileSettings;
  const layout = normalizeHeaderLayoutType(artisan.media.headerLayoutType);
  const nameInHero = layout === "brand_cover" || layout === "page_brand";
  const tradeLine = `${artisan.tradeLabel} - ${artisan.city}`;
  const primaryQuoteLabel = resolvePrimaryQuoteLabel(planTier, profileSettings.cta);
  const portfolioItems = artisan.portfolioItems ?? [];
  const showPortfolio =
    visibility.showPortfolioGallery && portfolioItems.length > 0;
  const showAbout =
    visibility.contentBlockMode === "about" && artisan.aboutSection?.body;
  const showInterventions =
    visibility.contentBlockMode === "interventions" &&
    visibility.showInterventionTags &&
    artisan.interventions.length > 0;
  const certificationBadges = artisan.certifications ?? [];
  /** Toujours la couleur artisan : le picker « bouton devis » doit se refléter. */
  const useBrandCta = true;
  const titleClass = onDarkCover
    ? "text-[1.7rem] font-bold leading-[1.12] tracking-[-0.04em] text-white sm:text-[1.85rem]"
    : "text-[1.7rem] font-bold leading-[1.12] tracking-[-0.03em] text-neutral-900 sm:text-[1.85rem]";
  const metaClass = onDarkCover
    ? "vitrine-cover-muted mt-2 mb-5 text-sm font-medium leading-relaxed tracking-tight text-white/80 sm:text-[15px]"
    : "mt-2 mb-5 text-sm font-medium leading-relaxed tracking-tight text-neutral-600 sm:text-[15px]";

  return (
    <section
      className={`px-4 text-center sm:px-5 ${
        hideIdentity ? "pb-2 pt-3" : "pb-2 pt-5 sm:pt-6"
      }`}
    >
      {!hideIdentity ? (
        <>
          {!nameInHero ? (
            <>
              <h1 className={titleClass}>{artisan.businessName}</h1>
              <p className={metaClass}>{tradeLine}</p>
            </>
          ) : (
            <div className="mb-4" />
          )}

          {visibility.showStatBadges ? (
            <VitrineStatBadges
              badges={artisan.statBadges}
              googleBusinessUrl={artisan.googleBusinessUrl}
              onDarkCover={onDarkCover}
            />
          ) : null}

          {showAbout && artisan.aboutSection ? (
            <VitrineAboutSection
              title={artisan.aboutSection.title}
              body={artisan.aboutSection.body}
            />
          ) : null}

          {certificationBadges.length > 0 ? (
            <VitrineCertificationBadges
              items={certificationBadges}
              ariaLabel={copy.presentation.certificationsAriaLabel}
            />
          ) : null}
        </>
      ) : null}

      {identityOnly ? null : (
        <>
          <VitrinePrimaryCtaButton
            label={primaryQuoteLabel}
            freeHint={copy.presentation.quoteFreeHint}
            onClick={() => onOpenDetails("quote")}
            useBrandColor={useBrandCta}
            onDarkCover={onDarkCover}
          />

          <VitrineActionButtons
            pageSlug={artisan.slug}
            artisanPhone={artisan.phone}
            serviceZone={artisan.serviceAreaSummary || artisan.city}
            copy={copy}
            planTier={planTier}
            profileSettings={profileSettings}
            theme={theme}
            onAction={onOpenDetails}
          />

          {showInterventions ? (
            <VitrineInterventionTags items={artisan.interventions} />
          ) : null}

          {showPortfolio ? (
            <VitrinePortfolioGallery
              items={portfolioItems}
              title={copy.presentation.portfolioTitle}
            />
          ) : null}

          <p
            className={`mt-5 flex items-center justify-center gap-1.5 text-xs ${
              onDarkCover ? "text-white/70" : "text-neutral-500"
            }`}
          >
            <span aria-hidden>📍</span>
            {artisan.serviceAreaSummary}
          </p>
        </>
      )}
    </section>
  );
}
