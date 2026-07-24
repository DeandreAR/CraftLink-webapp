import type {
  ArtisanVitrineProfile,
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineService,
  VitrineTheme,
} from "@/domain/vitrine";
import { normalizeHeaderLayoutType } from "@/domain/recommendedProduct";
import { resolvePrimaryQuoteLabel } from "@/lib/vitrine/ctaLabels";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineAboutSection } from "@/components/vitrine/VitrineAboutSection";
import { VitrineActionButtons } from "@/components/vitrine/VitrineActionButtons";
import { VitrineCertificationBadges } from "@/components/vitrine/VitrineCertificationBadges";
import { VitrineInterventionTags } from "@/components/vitrine/VitrineInterventionTags";
import { VitrinePortfolioGallery } from "@/components/vitrine/VitrinePortfolioGallery";
import { VitrineServicesPublicList } from "@/components/vitrine/VitrineServicesPublicList";
import { VitrinePrimaryCtaButton } from "@/components/vitrine/VitrinePrimaryCtaButton";
import { VitrineStatBadges } from "@/components/vitrine/VitrineStatBadges";

type VitrinePresentationProps = {
  artisan: ArtisanVitrineProfile;
  services?: VitrineService[];
  planTier: PublicPlanTier;
  theme: VitrineTheme;
  profileSettings: VitrineProfileSettings;
  copy: VitrineDictionary;
  servicesSurDevisLabel?: string;
  onOpenDetails: (intent: VitrineOpenIntent) => void;
  identityOnly?: boolean;
  hideIdentity?: boolean;
};

export function VitrinePresentation({
  artisan,
  services = [],
  planTier,
  theme,
  profileSettings,
  copy,
  servicesSurDevisLabel = "Sur devis",
  onOpenDetails,
  identityOnly = false,
  hideIdentity = false,
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
  const showServicesOnPresentation =
    visibility.showServicesOnPresentation && services.length > 0;
  const certificationBadges = artisan.certifications ?? [];
  const useBrandCta = isProPublicPlan(planTier);

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
              <h1 className="text-[1.65rem] font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[1.75rem]">
                {artisan.businessName}
              </h1>
              <p className="mt-2 mb-5 text-sm font-medium text-neutral-800 sm:text-[15px]">
                {tradeLine}
              </p>
            </>
          ) : (
            <div className="mb-4" />
          )}

          {visibility.showStatBadges ? (
            <VitrineStatBadges
              badges={artisan.statBadges}
              googleBusinessUrl={artisan.googleBusinessUrl}
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

          {showInterventions ? (
            <VitrineInterventionTags items={artisan.interventions} />
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

          {showServicesOnPresentation ? (
            <VitrineServicesPublicList
              services={services}
              title={copy.details.servicesTitle}
              surDevisLabel={servicesSurDevisLabel}
            />
          ) : null}

          {showPortfolio ? (
            <VitrinePortfolioGallery
              items={portfolioItems}
              title={copy.presentation.portfolioTitle}
            />
          ) : null}

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
            <span aria-hidden>📍</span>
            {artisan.serviceAreaSummary}
          </p>
        </>
      )}
    </section>
  );
}
