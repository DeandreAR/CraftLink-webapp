"use client";

import { useEffect, useState, type ReactNode } from "react";
import { OPEN_PROFILE_EDITOR_EVENT } from "@/lib/dashboard/vitrineTourEvents";

export type ProfileMobileSection = {
  id: string;
  label: string;
  content: ReactNode;
};

type ProfileMobileNavProps = {
  sections: ProfileMobileSection[];
  ariaLabel: string;
};

const DESKTOP_QUERY = "(min-width: 1024px)";

export function ProfileMobileNav({ sections, ariaLabel }: ProfileMobileNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const openEditor = () => {
      if (sections.some((s) => s.id === "editor")) {
        setActive("editor");
      }
    };
    window.addEventListener(OPEN_PROFILE_EDITOR_EVENT, openEditor);
    return () => window.removeEventListener(OPEN_PROFILE_EDITOR_EVENT, openEditor);
  }, [sections]);

  const current = sections.find((section) => section.id === active) ?? sections[0];

  const selectSection = (sectionId: string) => {
    setActive(sectionId);
    if (isDesktop) {
      document.getElementById(`profile-section-${sectionId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!current) return null;

  const tabList = (
    <div
      className="db-segmented scrollbar-hide mb-4 lg:sticky lg:top-4 lg:z-10"
      role="tablist"
      aria-label={ariaLabel}
    >
      {sections.map((section) => {
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-active={isActive ? "true" : undefined}
            onClick={() => selectSection(section.id)}
            className="db-segmented-item cursor-pointer text-[11px] md:text-xs"
          >
            {section.label}
          </button>
        );
      })}
    </div>
  );

  if (isDesktop) {
    return (
      <div>
        {tabList}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`profile-section-${section.id}`}
              className="scroll-mt-28"
            >
              {section.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {tabList}
      <div role="tabpanel">{current.content}</div>
    </div>
  );
}
