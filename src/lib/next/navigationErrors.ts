/** Erreurs internes Next.js (redirect / notFound) — à relancer, pas à logger. */
export function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const digest =
    "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;
  if (digest?.startsWith("NEXT_REDIRECT") || digest?.startsWith("NEXT_NOT_FOUND")) {
    return true;
  }

  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    return true;
  }

  return false;
}

export function rethrowIfNextNavigationError(error: unknown): void {
  if (isNextNavigationError(error)) {
    throw error;
  }
}
