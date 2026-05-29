"use client";

import { useEffect, useRef, useState } from "react";
import { LinkInBioPage, type LinkInBioPageProps } from "@/components/vitrine/LinkInBioPage";

const PREVIEW_SCALE = 0.52;
const PREVIEW_WIDTH = 430;

type OnboardingVitrinePreviewProps = {
  previewProps: LinkInBioPageProps;
  fontFamily: string;
  title: string;
  hint?: string;
};

export function OnboardingVitrinePreview({
  previewProps,
  fontFamily,
  title,
  hint,
}: OnboardingVitrinePreviewProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scaledHeight, setScaledHeight] = useState(480);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      setScaledHeight(Math.ceil(el.offsetHeight * PREVIEW_SCALE));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewProps]);

  const frameWidth = Math.round(PREVIEW_WIDTH * PREVIEW_SCALE);

  return (
    <div className="mx-auto w-full max-w-[300px] lg:max-w-none lg:sticky lg:top-4">
      <p className="mb-1 text-center text-xs font-semibold text-neutral-600">{title}</p>
      {hint ? (
        <p className="mb-2 text-center text-[10px] text-neutral-500">{hint}</p>
      ) : null}
      <div
        className="mx-auto max-h-[min(85vh,920px)] overflow-y-auto overflow-x-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-inner"
        aria-label={title}
        style={{ width: frameWidth }}
      >
        <div style={{ width: frameWidth, height: scaledHeight, overflow: "hidden" }}>
          <div
            ref={innerRef}
            className="pointer-events-none origin-top-left"
            style={{
              width: PREVIEW_WIDTH,
              transform: `scale(${PREVIEW_SCALE})`,
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
