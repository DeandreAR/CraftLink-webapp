"use client";

import { useEffect, useState } from "react";
import { FaMicrophone, FaPen, FaQrcode, FaStore } from "react-icons/fa6";
import type { Profile } from "@/domain/profile";
import { profileToDashboardUser } from "@/domain/dashboardUser";
import { DashboardViewTabs } from "@/components/dashboard/DashboardViewTabs";
import { PartnersSection } from "@/components/dashboard/vitrine/PartnersSection";
import { QrCodeVanModule } from "@/components/dashboard/vitrine/QrCodeVanModule";
import { VoiceCaptureSetting } from "@/components/dashboard/vitrine/VoiceCaptureSetting";
import { VitrineProfileForm } from "@/components/dashboard/vitrine/VitrineProfileForm";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";

type VitrineSubTab = "profile" | "capture" | "qr" | "partners";

type VitrinePanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function VitrinePanel({ profile, copy, locale }: VitrinePanelProps) {
  const [subTab, setSubTab] = useState<VitrineSubTab>("profile");
  const [dashboardUser, setDashboardUser] = useState(() => profileToDashboardUser(profile));
  const v = copy.vitrine;
  const plan = resolveCraftlinkPlan(profile.plan_tier);
  const pro = plan === "PRO";

  useEffect(() => {
    setDashboardUser(profileToDashboardUser(profile));
  }, [profile]);

  const subTabs = [
    {
      id: "profile" as const,
      label: v.subTabs.profile,
      icon: <FaPen className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "capture" as const,
      label: v.subTabs.capture,
      icon: <FaMicrophone className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "qr" as const,
      label: v.subTabs.qr,
      icon: <FaQrcode className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "partners" as const,
      label: v.subTabs.partners,
      icon: <FaStore className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  return (
    <section>
      <header className="mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-black md:text-[1.75rem]">
          {v.title}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{v.subtitle}</p>
      </header>

      <DashboardViewTabs
        tabs={subTabs}
        active={subTab}
        onChange={setSubTab}
        ariaLabel={v.title}
      />

      <div className="mt-6">
        {subTab === "profile" ? (
          <VitrineProfileForm profile={profile} copy={copy} locale={locale} />
        ) : null}
        {subTab === "capture" ? (
          <VoiceCaptureSetting
            plan={dashboardUser.plan}
            enabled={dashboardUser.voiceCaptureEnabled}
            onEnabledChange={(enabled) =>
              setDashboardUser((prev) => ({ ...prev, voiceCaptureEnabled: enabled }))
            }
            copy={copy}
            locale={locale}
          />
        ) : null}
        {subTab === "qr" ? (
          <QrCodeVanModule slug={profile.page_slug} copy={copy} />
        ) : null}
        {subTab === "partners" ? (
          <PartnersSection pro={pro} copy={copy} locale={locale} />
        ) : null}
      </div>
    </section>
  );
}
