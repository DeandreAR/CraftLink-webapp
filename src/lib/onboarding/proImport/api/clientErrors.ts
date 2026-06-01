import {
  PROVIDER_QUOTA_EXHAUSTED,
  PROVIDER_DEGRADED_MESSAGE,
} from "@/lib/onboarding/proImport/api/constants";

export class ProImportDegradedError extends Error {
  readonly errorType = PROVIDER_QUOTA_EXHAUSTED;

  constructor(message: string = PROVIDER_DEGRADED_MESSAGE) {
    super(message);
    this.name = "ProImportDegradedError";
  }
}

export function isProImportDegradedError(
  error: unknown,
): error is ProImportDegradedError {
  return error instanceof ProImportDegradedError;
}
