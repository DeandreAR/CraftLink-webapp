import "server-only";

import { buildAppUrl } from "@/config/app";
import type { ArtisanEmailProfile } from "@/lib/email/sendClientAcknowledgmentEmail";
import { sendArtisanNewLeadEmail } from "@/lib/email/sendArtisanNewLeadEmail";
import { sendClientAcknowledgmentEmail } from "@/lib/email/sendClientAcknowledgmentEmail";
import {
  isValidPushSubscription,
  sendWebPushNotification,
  type BrowserPushSubscription,
} from "@/lib/push/webPush";
import { createAdminClient } from "@/lib/supabase/admin";

export type NotifyNewLeadInput = {
  workspaceUserId: string;
  artisan: ArtisanEmailProfile;
  lead: {
    id: string;
    requestNumber: number;
    clientName: string;
    clientEmail: string;
    zone: string;
    delayStatus: string;
    workType: string;
    description: string;
  };
  /** Accusé de réception client (formulaire public). */
  sendClientAck?: boolean;
};

async function sendPushToArtisan(
  userId: string,
  leadId: string,
): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;

  const { data: rows, error } = await admin
    .from("push_subscriptions")
    .select("id, subscription_json")
    .eq("user_id", userId);

  if (error || !rows?.length) return;

  const url = buildAppUrl(`/dashboard/demandes/${leadId}`);
  const payload = {
    title: "🚨 Nouvelle demande CraftLink !",
    body: "Un client vient de faire une demande sur votre page.",
    url,
    leadId,
  };

  await Promise.allSettled(
    rows.map(async (row) => {
      const subscription = row.subscription_json;
      if (!isValidPushSubscription(subscription)) {
        await admin.from("push_subscriptions").delete().eq("id", row.id);
        return;
      }

      const result = await sendWebPushNotification(
        subscription as BrowserPushSubscription,
        payload,
      );

      if (!result.ok && (result.statusCode === 404 || result.statusCode === 410)) {
        await admin.from("push_subscriptions").delete().eq("id", row.id);
      }
    }),
  );
}

/**
 * Notifications post-capture : push + email artisan (+ accusé client optionnel).
 * À appeler via `after()` pour ne pas bloquer la réponse HTTP.
 */
export async function notifyNewLead(input: NotifyNewLeadInput): Promise<void> {
  const tasks: Promise<unknown>[] = [
    sendPushToArtisan(input.workspaceUserId, input.lead.id),
    sendArtisanNewLeadEmail(input.artisan, {
      leadId: input.lead.id,
      requestNumber: input.lead.requestNumber,
      clientName: input.lead.clientName,
      zone: input.lead.zone,
      delayStatus: input.lead.delayStatus,
      workType: input.lead.workType,
      description: input.lead.description,
    }),
  ];

  if (input.sendClientAck !== false) {
    tasks.push(
      sendClientAcknowledgmentEmail(
        {
          id: input.lead.id,
          requestNumber: input.lead.requestNumber,
          clientEmail: input.lead.clientEmail,
        },
        input.artisan,
      ),
    );
  }

  await Promise.allSettled(tasks);
}
