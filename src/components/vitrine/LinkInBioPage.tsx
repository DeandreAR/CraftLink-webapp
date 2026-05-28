"use client";

import { useState } from "react";
import type {
  ArtisanVitrineProfile,
  PublicPlanTier,
  VitrineInteractionState,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineService,
  VitrineTheme,
} from "@/domain/vitrine";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import { vitrineThemeStyle } from "@/lib/vitrine/theme";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineDetailsSection } from "@/components/vitrine/VitrineDetailsSection";
import { VitrinePresentation } from "@/components/vitrine/VitrinePresentation";
import { VitrineProfileHero } from "@/components/vitrine/VitrineProfileHero";

export type LinkInBioPageProps = {
  artisan: ArtisanVitrineProfile;
  services: VitrineService[];
  planTier: PublicPlanTier;
  theme: VitrineTheme;
  profileSettings: VitrineProfileSettings;
  copy: VitrineDictionary;
  interactionState?: VitrineInteractionState;
  onInteractionStateChange?: (state: VitrineInteractionState) => void;
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
}: LinkInBioPageProps) {
  const [internalState, setInternalState] =
    useState<VitrineInteractionState>("INITIAL");
  const [openIntent, setOpenIntent] = useState<VitrineOpenIntent>("quote");

  const interactionState = controlledState ?? internalState;
  const setInteractionState = (next: VitrineInteractionState) => {
    setInternalState(next);
    onInteractionStateChange?.(next);
  };

  const isPro = isProPublicPlan(planTier);
  const showDetails = interactionState === "DETAILS_VISIBLE";
  const showSocial =
    profileSettings.visibility.showSocialLinks && artisan.socialLinks.length > 0;

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

  return (
    <div className="min-h-screen bg-[#e8e8e8] font-sans sm:bg-neutral-200">
      <div
        className="mx-auto min-h-screen w-full max-w-md overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.1)] sm:my-3 sm:min-h-[calc(100dvh-1.5rem)] sm:rounded-[28px]"
        style={{
          ...vitrineThemeStyle(theme),
          backgroundColor: "#ffffff",
          color: "var(--v-text)",
        }}
      >
        <VitrineProfileHero artisan={artisan} showSocialLinks={showSocial} />

        {!showDetails ? (
          <>
            <VitrinePresentation
              artisan={artisan}
              planTier={planTier}
              profileSettings={profileSettings}
              onOpenDetails={openDetails}
            />
            {!isPro ? (
              <footer className="pb-8 pt-2 text-center">
                <a
                  href="/"
                  className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400"
                >
                  {copy.poweredBy}
                </a>
              </footer>
            ) : (
              <div className="h-8" aria-hidden />
            )}
          </>
        ) : (
          <div id="vitrine-details">
            <VitrineDetailsSection
              planTier={planTier}
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
