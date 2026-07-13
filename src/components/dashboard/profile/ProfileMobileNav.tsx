"use client";

import { useState, type ReactNode } from "react";

export type ProfileMobileSection = {
  id: string;
  label: string;
  content: ReactNode;
};

type ProfileMobileNavProps = {
  sections: ProfileMobileSection[];
};

export function ProfileMobileNav({ sections }: ProfileMobileNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const current = sections.find((section) => section.id === active) ?? sections[0];

  if (!current) return null;

  return (
    <div className="md:hidden">
      <div
        className="scrollbar-hide -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Sections profil"
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
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
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
