"use client";

import { useEffect, useState } from "react";
import type {
  ArtisanVitrineProfile,
  PublicPlanTier,
  VitrineInteractionState,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineService,
  VitrineTheme,
} from "@/domain/vitrine";
import { vitrineThemeStyle } from "@/lib/vitrine/theme";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineContentTabs } from "@/components/vitrine/VitrineContentTabs";
import { VitrineDetailsSection } from "@/components/vitrine/VitrineDetailsSection";
import { VitrineFooter } from "@/components/vitrine/VitrineFooter";
import { VitrinePresentation } from "@/components/vitrine/VitrinePresentation";
import { VitrineProfileHero } from "@/components/vitrine/VitrineProfileHero";
import { VitrineProSelectionPanel } from "@/components/vitrine/VitrineProSelectionPanel";

export type LinkInBioPageProps = {
  artisan: ArtisanVitrineProfile;
  services: VitrineService[];
  planTier: PublicPlanTier;
  theme: VitrineTheme;
  profileSettings: VitrineProfileSettings;
  copy: VitrineDictionary;
  interactionState?: VitrineInteractionState;
  onInteractionStateChange?: (state: VitrineInteractionState) => void;
  /** Aperçu onboarding : sans fond gris, interactions désactivées. */
  embedded?: boolean;
};

export function LinkInBioPage({
  artisan,
  services,
  planTier,
  theme,
  profileSettings,
  copy,
  interactionState: controlledState,
  onInteractionStateChange,
  embedded = false,
}: LinkInBioPageProps) {
  const [internalState, setInternalState] =
    useState<VitrineInteractionState>("INITIAL");
  const [openIntent, setOpenIntent] = useState<VitrineOpenIntent>("quote");
  const [contentTab, setContentTab] = useState<"contact" | "pro">("contact");
  const [tabLoading, setTabLoading] = useState(false);

  const interactionState = controlledState ?? internalState;
  const setInteractionState = (next: VitrineInteractionState) => {
    setInternalState(next);
    onInteractionStateChange?.(next);
  };

  const showDetails = interactionState === "DETAILS_VISIBLE";
  const showSocial =
    profileSettings.visibility.showSocialLinks && artisan.socialLinks.length > 0;
  const showProSelection = profileSettings.visibility.showProSelection;
  const proSelectionTitle =
    profileSettings.visibility.proSelectionTitle ||
    copy.presentation.proSelectionTitle;

  useEffect(() => {
    if (embedded) return;
    document.documentElement.classList.add("scrollbar-hide");
    return () => {
      document.documentElement.classList.remove("scrollbar-hide");
    };
  }, [embedded]);

  const openDetails = (intent: VitrineOpenIntent) => {
    setOpenIntent(intent);
    setInteractionState("DETAILS_VISIBLE");
    window.setTimeout(() => {
      document.getElementById("vitrine-details")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const switchTab = (tab: "contact" | "pro") => {
    if (tab === contentTab) return;
    setTabLoading(true);
    setContentTab(tab);
    window.setTimeout(() => setTabLoading(false), 180);
  };

  return (
    <div
      className={
        embedded
          ? "bg-white font-sans"
          : "min-h-screen bg-[#e8e8e8] font-sans sm:bg-neutral-200"
      }
    >
      <div
        className={
          embedded
            ? "mx-auto flex w-full max-w-md flex-col overflow-x-hidden bg-white"
            : "mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.1)] sm:my-3 sm:min-h-[calc(100dvh-1.5rem)] sm:rounded-[28px]"
        }
        style={{
          ...vitrineThemeStyle(theme),
          backgroundColor: "#ffffff",
          color: "var(--v-text)",
        }}
      >
        <VitrineProfileHero artisan={artisan} showSocialLinks={showSocial} />

        {!showDetails ? (
          <>
            {showProSelection ? (
              <>
                <VitrinePresentation
                  artisan={artisan}
                  services={services}
                  planTier={planTier}
                  theme={theme}
                  profileSettings={profileSettings}
                  copy={copy}
                  servicesSurDevisLabel={copy.services.surDevis}
                  onOpenDetails={openDetails}
                  identityOnly
                />

                <VitrineContentTabs
                  contactLabel={copy.presentation.contactTabLabel}
                  proSelectionLabel={proSelectionTitle}
                  active={contentTab}
                  onChange={switchTab}
                  showProSelection
                />

                {tabLoading ? (
                  <div className="space-y-3 px-4 py-6 sm:px-5">
                    <div className="h-10 animate-pulse rounded-2xl bg-neutral-100" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
                      <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
                    </div>
                  </div>
                ) : contentTab === "pro" ? (
                  <VitrineProSelectionPanel
                    products={artisan.recommendedProducts ?? []}
                    searchPlaceholder={copy.presentation.proSelectionSearch}
                    emptyLabel={copy.presentation.proSelectionEmpty}
                    ctaLabel={copy.presentation.proSelectionCta}
                  />
                ) : (
                  <VitrinePresentation
                    artisan={artisan}
                    services={services}
                    planTier={planTier}
                    theme={theme}
                    profileSettings={profileSettings}
                    copy={copy}
                    servicesSurDevisLabel={copy.services.surDevis}
                    onOpenDetails={openDetails}
                    hideIdentity
                  />
                )}
              </>
            ) : (
              <VitrinePresentation
                artisan={artisan}
                services={services}
                planTier={planTier}
                theme={theme}
                profileSettings={profileSettings}
                copy={copy}
                servicesSurDevisLabel={copy.services.surDevis}
                onOpenDetails={openDetails}
              />
            )}

            <VitrineFooter label={copy.poweredBy} />
          </>
        ) : (
          <div id="vitrine-details" className="flex-1">
            <VitrineDetailsSection
              pageSlug={artisan.slug}
              zone={artisan.serviceAreaSummary || artisan.city}
              metierKey={artisan.metierKey}
              planTier={planTier}
              profileSettings={profileSettings}
              services={services}
              copy={copy}
              initialIntent={openIntent}
              onBack={() => setInteractionState("INITIAL")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
