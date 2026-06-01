import {
  PROVIDER_DEGRADED_MESSAGE,
  PROVIDER_QUOTA_EXHAUSTED,
} from "@/lib/onboarding/proImport/api/constants";

export class ProviderDegradedError extends Error {
  readonly errorType = PROVIDER_QUOTA_EXHAUSTED;

  constructor(message: string = PROVIDER_DEGRADED_MESSAGE, options?: { cause?: unknown }) {
    super(message);
    this.name = "ProviderDegradedError";
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

const QUOTA_MESSAGE_PATTERN =
  /quota|rate.?limit|too many requests|run out|insufficient credit|exceeded|limit reached/i;

export function isQuotaHttpStatus(status: number): boolean {
  return status === 429;
}

export function isQuotaMessage(text: string): boolean {
  return QUOTA_MESSAGE_PATTERN.test(text);
}

export function isNetworkFailure(error: unknown): boolean {
  if (error instanceof ProviderDegradedError) return true;
  if (error instanceof TypeError) return true;
  if (!(error instanceof Error)) return false;

  const code = (error as NodeJS.ErrnoException).code;
  return (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "EAI_AGAIN"
  );
}

export function throwIfQuotaHttpStatus(status: number, bodyPreview = ""): void {
  if (isQuotaHttpStatus(status) || isQuotaMessage(bodyPreview)) {
    throw new ProviderDegradedError();
  }
}

export function throwIfQuotaInProviderError(message: string): void {
  if (isQuotaMessage(message) || /HTTP 429\b/.test(message)) {
    throw new ProviderDegradedError();
  }
}
