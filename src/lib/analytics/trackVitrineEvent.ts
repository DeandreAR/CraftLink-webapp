"use client";

import { useEffect } from "react";
import type { AnalyticsEventType } from "@/domain/analytics";

export function trackVitrineEvent(slug: string, eventType: AnalyticsEventType): void {
  if (!slug) return;
  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, eventType }),
    keepalive: true,
  }).catch(() => {
    /* tracking non bloquant */
  });
}

type VitrinePageViewTrackerProps = {
  slug: string;
};

/** Envoie un page_view une fois au montage de la vitrine publique. */
export function VitrinePageViewTracker({ slug }: VitrinePageViewTrackerProps) {
  useEffect(() => {
    if (!slug || slug === "apercu") return;
    trackVitrineEvent(slug, "page_view");
  }, [slug]);

  return null;
}
