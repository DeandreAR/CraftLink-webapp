"use client";

import { useEffect, useState } from "react";
import { FaPen, FaQrcode } from "react-icons/fa6";
import type { Profile } from "@/domain/profile";
import { DashboardViewTabs } from "@/components/dashboard/DashboardViewTabs";
import { QrCodeVanModule } from "@/components/dashboard/vitrine/QrCodeVanModule";
import { VitrineEditor } from "@/components/dashboard/vitrine/VitrineEditor";
import { VoiceCaptureSetting } from "@/components/dashboard/vitrine/VoiceCaptureSetting";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type VitrineSubTab = "profile" | "qr";

type VitrinePanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  onboardingCopy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  locale: Locale;
};

export function VitrinePanel({
  profile,
  copy,
  onboardingCopy,
  vitrineCopy,
  locale,
}: VitrinePanelProps) {
  const [subTab, setSubTab] = useState<VitrineSubTab>("profile");
  const v = copy.vitrine;

  const subTabs = [
    {
      id: "profile" as const,
      label: v.subTabs.profile,
      icon: <FaPen className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "qr" as const,
      label: v.subTabs.qr,
      icon: <FaQrcode className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  return (
    <section>
      <header className="mb-1">
        <h1 className="lk-display text-2xl md:text-[1.75rem]">
          {v.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{v.subtitle}</p>
      </header>

      <DashboardViewTabs
        tabs={subTabs}
        active={subTab}
        onChange={setSubTab}
        ariaLabel={v.title}
      />

      <div className="mt-6">
        {subTab === "profile" ? (
          <div className="space-y-6">
            <VitrineEditor
              profile={profile}
              copy={copy}
              onboardingCopy={onboardingCopy}
              vitrineCopy={vitrineCopy}
              locale={locale}
            />
            <VoiceCaptureSetting profile={profile} copy={copy} locale={locale} />
          </div>
        ) : null}
        {subTab === "qr" ? (
          <QrCodeVanModule slug={profile.page_slug} copy={copy} />
        ) : null}
      </div>
    </section>
  );
}
