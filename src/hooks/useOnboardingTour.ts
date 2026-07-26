import { useEffect, useRef } from "react";
import { driver, type DriveStep } from "driver.js";

export type OnboardingTourStep = {
  element: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
};

export type UseOnboardingTourOptions = {
  /** Délai avant démarrage (DOM prêt). */
  delayMs?: number;
  /** Si false, le tour ne démarre pas. */
  enabled?: boolean;
  /** Préparation DOM avant le tour. */
  prepare?: () => void | Promise<void>;
  /** Appelé avant chaque étape (ex. changer d’onglet). */
  onBeforeStep?: (elementKey: string) => void | Promise<void>;
  prevLabel: string;
  nextLabel: string;
  doneLabel: string;
};

function storageKey(ongletKey: string): string {
  return `craftlink_tour_seen_${ongletKey}`;
}

export function hasSeenOnboardingTour(ongletKey: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(storageKey(ongletKey)) === "true";
  } catch {
    return true;
  }
}

export function markOnboardingTourSeen(ongletKey: string): void {
  try {
    window.localStorage.setItem(storageKey(ongletKey), "true");
  } catch {
    /* private mode / quota */
  }
}

/**
 * Lance un tour Driver.js à la première visite de l’onglet (localStorage).
 * Navigation : ‹ précédent / › suivant — la croix ferme le tour.
 */
export function useOnboardingTour(
  ongletKey: string,
  steps: OnboardingTourStep[],
  options: UseOnboardingTourOptions,
): void {
  const {
    delayMs = 500,
    enabled = true,
    prepare,
    onBeforeStep,
    prevLabel,
    nextLabel,
    doneLabel,
  } = options;

  const startedRef = useRef(false);
  const prepareRef = useRef(prepare);
  prepareRef.current = prepare;
  const onBeforeStepRef = useRef(onBeforeStep);
  onBeforeStepRef.current = onBeforeStep;
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  useEffect(() => {
    if (!enabled || stepsRef.current.length === 0 || startedRef.current) return;
    if (hasSeenOnboardingTour(ongletKey)) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let destroyDriver: (() => void) | undefined;

    const run = async () => {
      await prepareRef.current?.();
      if (cancelled) return;

      const driveSteps: DriveStep[] = stepsRef.current.map((step) => ({
        element: `[data-tour="${step.element}"]`,
        popover: {
          title: step.title,
          description: step.description,
          side: step.side ?? "bottom",
          align: "start",
        },
      }));

      const tour = driver({
        animate: true,
        smoothScroll: true,
        allowClose: true,
        overlayOpacity: 0.45,
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: "craftlink-driver-popover",
        showProgress: true,
        progressText: "{{current}} / {{total}}",
        showButtons: ["next", "previous", "close"],
        nextBtnText: nextLabel,
        doneBtnText: doneLabel,
        prevBtnText: prevLabel,
        skipMissingElement: true,
        waitForElement: 1600,
        onHighlightStarted: async (_el, step) => {
          const selector =
            typeof step.element === "string" ? step.element : undefined;
          const match = selector?.match(/data-tour="([^"]+)"/);
          const key = match?.[1];
          if (key) {
            await onBeforeStepRef.current?.(key);
          }
        },
        onCloseClick: (_el, _step, { driver: d }) => {
          d.destroy();
        },
        onDestroyed: () => {
          markOnboardingTourSeen(ongletKey);
        },
        steps: driveSteps,
      });

      destroyDriver = () => tour.destroy();
      startedRef.current = true;
      tour.drive();
    };

    timer = setTimeout(() => {
      void run();
    }, delayMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      destroyDriver?.();
    };
  }, [ongletKey, enabled, delayMs, prevLabel, nextLabel, doneLabel]);
}
