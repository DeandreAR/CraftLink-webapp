"use client";

import { useState, type ReactNode } from "react";

export type ProfileMobileSection = {
  id: string;
  label: string;
  content: ReactNode;
};

type ProfileMobileNavProps = {
  sections: ProfileMobileSection[];
  ariaLabel: string;
};

export function ProfileMobileNav({ sections, ariaLabel }: ProfileMobileNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const current = sections.find((section) => section.id === active) ?? sections[0];

  if (!current) return null;

  return (
    <div>
      <div
        className="scrollbar-hide -mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1 md:mb-5 md:gap-2"
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
              onClick={() => setActive(section.id)}
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
      <div role="tabpanel">{current.content}</div>
    </div>
  );
}
