/** Chemin interne sûr après connexion (évite les redirections ouvertes). */
export function safeNextPath(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  return trimmed;
}
