import "server-only";

import type { TrialEmailKind } from "@/emails/trial-emails";
import { buildTrialAbonnementCtaUrl } from "@/lib/email/trial/urls";
import { sendTrialEmail } from "@/lib/resend/trialEmails";
import { createAdminClient } from "@/lib/supabase/admin";
import { utcCalendarDayBoundsFromToday } from "@/lib/trial/dateBounds";
import {
  countWorkspaceLeads,
  finalizeExpiredTrialProfile,
  markTrialEmailSent,
  resolveUserEmail,
  type TrialCronProfileRow,
} from "@/lib/trial/trialCronHelpers";

export type TrialEmailCronStats = {
  midTrial: { candidates: number; sent: number; failed: number };
  warning: { candidates: number; sent: number; failed: number };
  expired: { candidates: number; sent: number; failed: number; finalized: number };
};

export type RunTrialEmailCronResult =
  | { ok: true; stats: TrialEmailCronStats }
  | { ok: false; error: string };

const PROFILE_SELECT =
  "id, full_name, trial_ends_at, trial_email_mid_sent_at, trial_email_warning_sent_at, trial_email_expired_sent_at";

async function processTrialEmailBatch(input: {
  profiles: TrialCronProfileRow[];
  kind: TrialEmailKind;
  sentField:
    | "trial_email_mid_sent_at"
    | "trial_email_warning_sent_at"
    | "trial_email_expired_sent_at";
  includeLeadsCount: boolean;
  finalizeOnSend: boolean;
}): Promise<{ sent: number; failed: number; finalized: number }> {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Supabase admin client unavailable");
  }

  const ctaUrl = buildTrialAbonnementCtaUrl();
  let sent = 0;
  let failed = 0;
  let finalized = 0;

  for (const profile of input.profiles) {
    const email = await resolveUserEmail(admin, profile.id);
    if (!email) {
      failed += 1;
      continue;
    }

    const leadsCount = input.includeLeadsCount
      ? await countWorkspaceLeads(admin, profile.id)
      : undefined;

    const sendResult = await sendTrialEmail(input.kind, email, {
      recipientName: profile.full_name,
      ctaUrl,
      leadsCount,
      trialEndsAt: profile.trial_ends_at,
    });

    if (!sendResult.ok) {
      failed += 1;
      console.error(`[trial-cron] ${input.kind} send failed`, profile.id, sendResult.error);
      continue;
    }

    const markResult = await markTrialEmailSent(admin, profile.id, input.sentField);
    if (!markResult.ok) {
      failed += 1;
      console.error(`[trial-cron] ${input.kind} mark failed`, profile.id, markResult.error);
      continue;
    }

    if (input.finalizeOnSend) {
      const finalizeResult = await finalizeExpiredTrialProfile(admin, profile.id);
      if (!finalizeResult.ok) {
        console.error(`[trial-cron] finalize failed`, profile.id, finalizeResult.error);
      } else {
        finalized += 1;
      }
    }

    sent += 1;
  }

  return { sent, failed, finalized };
}

export async function runTrialEmailCron(): Promise<RunTrialEmailCronResult> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client unavailable" };
  }

  const nowIso = new Date().toISOString();
  const day7 = utcCalendarDayBoundsFromToday(7);
  const day2 = utcCalendarDayBoundsFromToday(2);

  const [midRes, warningRes, expiredRes] = await Promise.all([
    admin
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("is_subscribed", false)
      .is("trial_email_mid_sent_at", null)
      .gte("trial_ends_at", day7.startIso)
      .lt("trial_ends_at", day7.endIso),
    admin
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("is_subscribed", false)
      .is("trial_email_warning_sent_at", null)
      .gte("trial_ends_at", day2.startIso)
      .lt("trial_ends_at", day2.endIso),
    admin
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("is_subscribed", false)
      .is("trial_email_expired_sent_at", null)
      .lte("trial_ends_at", nowIso),
  ]);

  if (midRes.error || warningRes.error || expiredRes.error) {
    const message =
      midRes.error?.message ??
      warningRes.error?.message ??
      expiredRes.error?.message ??
      "Requête profils échouée";
    return { ok: false, error: message };
  }

  const midProfiles = (midRes.data ?? []) as TrialCronProfileRow[];
  const warningProfiles = (warningRes.data ?? []) as TrialCronProfileRow[];
  const expiredProfiles = (expiredRes.data ?? []) as TrialCronProfileRow[];

  try {
    const [midStats, warningStats, expiredStats] = await Promise.all([
      processTrialEmailBatch({
        profiles: midProfiles,
        kind: "mid_trial",
        sentField: "trial_email_mid_sent_at",
        includeLeadsCount: true,
        finalizeOnSend: false,
      }),
      processTrialEmailBatch({
        profiles: warningProfiles,
        kind: "warning",
        sentField: "trial_email_warning_sent_at",
        includeLeadsCount: false,
        finalizeOnSend: false,
      }),
      processTrialEmailBatch({
        profiles: expiredProfiles,
        kind: "expired",
        sentField: "trial_email_expired_sent_at",
        includeLeadsCount: false,
        finalizeOnSend: true,
      }),
    ]);

    return {
      ok: true,
      stats: {
        midTrial: {
          candidates: midProfiles.length,
          sent: midStats.sent,
          failed: midStats.failed,
        },
        warning: {
          candidates: warningProfiles.length,
          sent: warningStats.sent,
          failed: warningStats.failed,
        },
        expired: {
          candidates: expiredProfiles.length,
          sent: expiredStats.sent,
          failed: expiredStats.failed,
          finalized: expiredStats.finalized,
        },
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cron essai échoué";
    return { ok: false, error: message };
  }
}
