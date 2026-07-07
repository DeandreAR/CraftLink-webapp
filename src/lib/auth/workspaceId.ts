/** Workspace tenant id — aligné sur `mapProfile` (fallback `id` si colonne absente/null). */
export function resolveProfileWorkspaceId(
  userId: string,
  workspaceIdFromDb: string | null | undefined,
): string {
  if (workspaceIdFromDb != null && String(workspaceIdFromDb).trim()) {
    return String(workspaceIdFromDb);
  }
  return userId;
}
