"use client";

import { useEffect } from "react";

type OnboardingEmailConfirmedBannerProps = {
  title: string;
  message: string;
};

/** Affiché une fois après le clic sur « Confirmer mon e-mail » (redirect ?confirmed=1). */
export function OnboardingEmailConfirmedBanner({
  title,
  message,
}: OnboardingEmailConfirmedBannerProps) {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("confirmed")) return;
    url.searchParams.delete("confirmed");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", next);
  }, []);

  return (
    <div
      className="mb-6 flex gap-3 rounded-[20px] border border-emerald-200/80 bg-[#B2F5EA]/25 px-4 py-4 sm:px-5"
      role="status"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg"
        aria-hidden
      >
        ✓
      </span>
      <div>
        <p className="font-semibold text-emerald-950">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-emerald-900/90">{message}</p>
      </div>
    </div>
  );
}
