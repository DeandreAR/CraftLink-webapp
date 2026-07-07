"use client";

import { FaUsers } from "react-icons/fa6";
import type { DashboardDictionary } from "@/i18n/types";

type TeamSectionProps = {
  copy: DashboardDictionary;
};

export function TeamSection({ copy }: TeamSectionProps) {
  const t = copy.team;

  return (
    <div className="rounded-[18px] border border-neutral-200 bg-white p-4 opacity-90">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
          <FaUsers className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-black">{t.title}</h3>
          <p className="mt-1 text-sm text-neutral-600">{t.subtitle}</p>
        </div>
      </div>

      <div
        className="mt-4 cursor-not-allowed rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3"
        aria-disabled="true"
      >
        <p className="text-sm text-neutral-400 line-through decoration-neutral-400">
          {t.strikethrough}
        </p>
      </div>

      <div
        className="mt-3 rounded-xl border border-[#EFA188]/40 bg-[#EFA188]/10 px-4 py-3"
        role="status"
      >
        <p className="text-sm font-bold text-black">{t.comingSoonTitle}</p>
        <p className="mt-1 text-sm text-neutral-700">{t.comingSoonBody}</p>
      </div>
    </div>
  );
}
