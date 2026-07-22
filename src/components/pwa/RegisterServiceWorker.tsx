"use client";

import { useEffect } from "react";

/** Enregistre le Service Worker CraftLink dès le chargement du dashboard. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);

  return null;
}
