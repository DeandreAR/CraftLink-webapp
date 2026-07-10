import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AuthResult } from "@/domain/auth";
import type { Profile } from "@/domain/profile";
import { resolveProfileWorkspaceId } from "@/lib/auth/workspaceId";
import { getSessionWithProfile } from "@/services/authService";

/** Session authentifiée + profil — prête pour filtrer par workspace. */
export type WorkspaceSession = {
  user: User;
  profile: Profile;
  /** Identifiant tenant pour `.eq("workspace_id", workspaceId)` sur leads, services, etc. */
  workspaceId: string;
};

export function workspaceIdFromProfile(profile: Profile): string {
  return resolveProfileWorkspaceId(profile.id, profile.workspace_id);
}

export async function resolveWorkspaceSession(
  supabase: SupabaseClient,
): Promise<AuthResult<WorkspaceSession | null>> {
  const session = await getSessionWithProfile(supabase);

  if (!session.ok) {
    return session;
  }

  if (!session.data) {
    return { ok: true, data: null };
  }

  const { user, profile } = session.data;

  return {
    ok: true,
    data: {
      user,
      profile,
      workspaceId: workspaceIdFromProfile(profile),
    },
  };
}
