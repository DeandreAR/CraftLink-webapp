import type {
  ArtisanVitrineProfile,
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
} from "@/domain/vitrine";
import { resolvePrimaryQuoteLabel } from "@/lib/vitrine/ctaLabels";
import { VitrineActionButtons } from "@/components/vitrine/VitrineActionButtons";
import { VitrineInterventionTags } from "@/components/vitrine/VitrineInterventionTags";
import { VitrinePrimaryCtaButton } from "@/components/vitrine/VitrinePrimaryCtaButton";
import { VitrineStatBadges } from "@/components/vitrine/VitrineStatBadges";

type VitrinePresentationProps = {
  artisan: ArtisanVitrineProfile;
  planTier: PublicPlanTier;
  profileSettings: VitrineProfileSettings;
  onOpenDetails: (intent: VitrineOpenIntent) => void;
};

export function VitrinePresentation({
  artisan,
  planTier,
  profileSettings,
  onOpenDetails,
}: VitrinePresentationProps) {
  const { visibility } = profileSettings;
  const tradeLine = `${artisan.tradeLabel} - ${artisan.city}`;
  const primaryQuoteLabel = resolvePrimaryQuoteLabel(planTier, profileSettings.cta);

  return (
    <section className="px-4 pb-8 pt-5 text-center sm:px-5 sm:pt-6">
      <h1 className="text-[1.65rem] font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[1.75rem]">
        {artisan.businessName}
      </h1>
      <p className="mt-2 mb-5 text-sm font-medium text-neutral-800 sm:text-[15px]">
        {tradeLine}
      </p>

      {visibility.showStatBadges ? (
        <VitrineStatBadges
          badges={artisan.statBadges}
          googleBusinessUrl={artisan.googleBusinessUrl}
        />
      ) : null}

      {visibility.showInterventionTags && artisan.interventions.length > 0 ? (
        <VitrineInterventionTags items={artisan.interventions} />
      ) : null}

      <VitrinePrimaryCtaButton
        label={primaryQuoteLabel}
        onClick={() => onOpenDetails("quote")}
      />

      <VitrineActionButtons
        planTier={planTier}
        profileSettings={profileSettings}
        onAction={onOpenDetails}
      />

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
        <span aria-hidden>📍</span>
        {artisan.serviceAreaSummary}
      </p>
    </section>
  );
}
