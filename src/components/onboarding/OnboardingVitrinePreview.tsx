"use client";

import { useEffect, useRef, useState } from "react";
import { LinkInBioPage, type LinkInBioPageProps } from "@/components/vitrine/LinkInBioPage";

const PREVIEW_SCALE = 0.82;
const PREVIEW_WIDTH = 430;

type OnboardingVitrinePreviewProps = {
  previewProps: LinkInBioPageProps;
  fontFamily: string;
  title: string;
  hint?: string;
  /** Aperçu pleine largeur (étape validation). */
  variant?: "compact" | "large";
  /** Permet le scroll / interaction (iframe Instagram sur l’étape validation). */
  interactive?: boolean;
  className?: string;
};

export function OnboardingVitrinePreview({
  previewProps,
  fontFamily,
  title,
  hint,
  variant = "compact",
  interactive = false,
  className = "",
}: OnboardingVitrinePreviewProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scaledHeight, setScaledHeight] = useState(560);
  const scale = variant === "large" ? 1 : PREVIEW_SCALE;
  const frameWidth =
    variant === "large" ? "100%" : Math.round(PREVIEW_WIDTH * PREVIEW_SCALE);

  useEffect(() => {
    if (variant === "large") return;
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      setScaledHeight(Math.ceil(el.offsetHeight * PREVIEW_SCALE));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewProps, variant]);

  if (variant === "large") {
    return (
      <div className={`flex min-h-0 w-full flex-col ${className}`}>
        {title ? (
          <p className="mb-2 shrink-0 text-center text-sm font-semibold text-neutral-700">
            {title}
          </p>
        ) : null}
        {hint ? (
          <p className="mb-3 shrink-0 text-center text-xs text-neutral-500">{hint}</p>
        ) : null}
        <div
          className="scrollbar-hide max-h-[min(75vh,720px)] overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-[28px] border border-neutral-200 bg-white shadow-lg touch-pan-y"
          style={{ fontFamily }}
          aria-label={title || "Aperçu page"}
        >
          <LinkInBioPage {...previewProps} embedded />
        </div>
      </div>
    );
  }

  const numericWidth = typeof frameWidth === "number" ? frameWidth : PREVIEW_WIDTH;

  return (
    <div
      className={`mx-auto w-full max-w-[min(100%,420px)] lg:max-w-none lg:sticky lg:top-4 ${className}`}
    >
      {title ? (
        <p className="mb-1 text-center text-xs font-semibold text-neutral-600">{title}</p>
      ) : null}
      {hint ? (
        <p className="mb-2 text-center text-[10px] text-neutral-500">{hint}</p>
      ) : null}
      <div
        className="scrollbar-hide mx-auto max-h-[min(65vh,600px)] overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-inner touch-pan-y"
        aria-label={title || "Aperçu page"}
        style={{ width: numericWidth }}
      >
        <div style={{ width: numericWidth, height: scaledHeight }}>
          <div
            ref={innerRef}
            className={`origin-top-left ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{
              width: PREVIEW_WIDTH,
              transform: `scale(${scale})`,
              fontFamily,
            }}
          >
            <LinkInBioPage {...previewProps} embedded />
          </div>
        </div>
      </div>
    </div>
  );
}
