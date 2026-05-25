"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/domain/profile";
import { formatAuthDebugMessage, logAuthError } from "@/lib/auth/debugError";
import { isMissingAuthSessionError } from "@/lib/supabase/authErrors";
import { createClient } from "@/lib/supabase/client";
import { getProfileByUserId } from "@/services/profileService";

export type SessionProfileState = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  workspaceId: string | null;
  error: string | null;
};

const INITIAL: SessionProfileState = {
  loading: true,
  user: null,
  profile: null,
  workspaceId: null,
  error: null,
};

/**
 * Session Supabase + profil pour les pages client sécurisées.
 * Utilisez `workspaceId` pour filtrer les données tenant :
 * `.eq("workspace_id", workspaceId)` sur leads, services, etc.
 */
export function useSessionProfile() {
  const [state, setState] = useState<SessionProfileState>(INITIAL);

  const refresh = useCallback(async () => {
    let supabase;
    try {
      supabase = createClient();
    } catch (error) {
      logAuthError("useSessionProfile.createClient", error);
      setState({
        loading: false,
        user: null,
        profile: null,
        workspaceId: null,
        error: formatAuthDebugMessage(
          "supabase.createClient",
          error instanceof Error ? error : null,
          "Configuration Supabase indisponible côté client.",
        ),
      });
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      if (isMissingAuthSessionError(authError)) {
        setState({
          loading: false,
          user: null,
          profile: null,
          workspaceId: null,
          error: null,
        });
        return;
      }

      logAuthError("useSessionProfile.getUser", authError);
      setState({
        loading: false,
        user: null,
        profile: null,
        workspaceId: null,
        error: formatAuthDebugMessage(
          "auth.getUser",
          authError,
          authError.message,
        ),
      });
      return;
    }

    if (!user) {
      setState({
        loading: false,
        user: null,
        profile: null,
        workspaceId: null,
        error: null,
      });
      return;
    }

    const profileResult = await getProfileByUserId(supabase, user.id);
    if (!profileResult.ok) {
      logAuthError("useSessionProfile.profile", profileResult.error);
      setState({
        loading: false,
        user,
        profile: null,
        workspaceId: null,
        error: profileResult.error,
      });
      return;
    }

    setState({
      loading: false,
      user,
      profile: profileResult.data,
      workspaceId: profileResult.data?.workspace_id ?? null,
      error: profileResult.data ? null : "Profil artisan introuvable.",
    });
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  return { ...state, refresh };
}
