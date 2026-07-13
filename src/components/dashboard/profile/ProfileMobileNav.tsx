"use client";

import { useEffect, useState, type ReactNode } from "react";

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
      className="scrollbar-hide -mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1 md:mb-5 md:gap-2 lg:sticky lg:top-4 lg:z-10 lg:bg-[#FDFBF7]/95 lg:backdrop-blur-sm"
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
            onClick={() => selectSection(section.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition md:px-4 md:py-2 md:text-xs ${
              isActive
                ? "bg-[#212129] text-white"
                : "border border-[#212129]/12 bg-white text-[#5b6478]"
            }`}
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
