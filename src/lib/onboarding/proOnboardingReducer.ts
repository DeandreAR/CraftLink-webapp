import {
  defaultOnboardingProfile,
  type OnboardingProfileDraft,
  type OnboardingService,
} from "@/domain/onboarding";
import type { ProRequiredFieldKey } from "@/lib/onboarding/proRequiredFields";

export type ProOnboardingPhase =
  | "choice"
  | "importing"
  | "gap"
  | "validate"
  | "manual-general"
  | "manual-interventions"
  | "manual-visual"
  | "complete";

export type ProOnboardingState = {
  phase: ProOnboardingPhase;
  profile: OnboardingProfileDraft;
  services: OnboardingService[];
  importError: string | null;
  publishing: boolean;
  publishError: string | null;
  gapFields: ProRequiredFieldKey[];
};

export type ProOnboardingAction =
  | { type: "SET_PHASE"; phase: ProOnboardingPhase }
  | { type: "PATCH_PROFILE"; patch: Partial<OnboardingProfileDraft> }
  | { type: "SET_SERVICES"; services: OnboardingService[] }
  | { type: "SET_IMPORT_ERROR"; error: string | null }
  | { type: "SET_GAP_FIELDS"; fields: ProRequiredFieldKey[] }
  | { type: "SET_PUBLISHING"; publishing: boolean }
  | { type: "SET_PUBLISH_ERROR"; error: string | null };

export function createProOnboardingState(
  initial?: Partial<{
    profile: OnboardingProfileDraft;
    services: OnboardingService[];
    phase: ProOnboardingPhase;
  }>,
): ProOnboardingState {
  return {
    phase: initial?.phase ?? "choice",
    profile: initial?.profile ?? defaultOnboardingProfile("PRO"),
    services: initial?.services ?? [],
    importError: null,
    publishing: false,
    publishError: null,
    gapFields: [],
  };
}

export function proOnboardingReducer(
  state: ProOnboardingState,
  action: ProOnboardingAction,
): ProOnboardingState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "PATCH_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "SET_SERVICES":
      return { ...state, services: action.services };
    case "SET_IMPORT_ERROR":
      return { ...state, importError: action.error };
    case "SET_GAP_FIELDS":
      return { ...state, gapFields: action.fields };
    case "SET_PUBLISHING":
      return { ...state, publishing: action.publishing };
    case "SET_PUBLISH_ERROR":
      return { ...state, publishError: action.error };
    default:
      return state;
  }
}

export const MANUAL_PRO_PHASES: ProOnboardingPhase[] = [
  "manual-general",
  "manual-interventions",
  "manual-visual",
];
