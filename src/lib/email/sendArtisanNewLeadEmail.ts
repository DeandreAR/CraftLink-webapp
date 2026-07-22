import { buildAppUrl } from "@/config/app";
import { getResendClient, RESEND_FROM_EMAIL } from "@/lib/email/resendClient";
import type { ArtisanEmailProfile } from "@/lib/email/sendClientAcknowledgmentEmail";

export type ArtisanNewLeadEmailInput = {
  leadId: string;
  requestNumber: number;
  clientName: string;
  zone: string;
  delayStatus: string;
  workType: string;
  description: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function delayLabel(status: string): string {
  switch (status) {
    case "urgent":
      return "Urgent";
    case "asap":
      return "Dès que possible";
    case "planned":
      return "Planifié";
    case "info":
      return "Demande d'info";
    default:
      return status;
  }
}

export async function sendArtisanNewLeadEmail(
  artisan: ArtisanEmailProfile,
  lead: ArtisanNewLeadEmailInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = artisan.email.trim();
  if (!to || to.endsWith("@craftlink.local")) {
    return { ok: false, error: "Email artisan indisponible" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY manquante" };
  }

  const ctaUrl = buildAppUrl(`/dashboard/demandes/${lead.leadId}`);
  const dossier = String(lead.requestNumber).padStart(4, "0");
  const subject = `Nouvelle demande #${dossier} — ${lead.clientName}`;

  const html = `<!DOCTYPE html>
<html lang="fr">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#212129;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f8f8;padding:28px 14px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;border:1px solid #ececec;overflow:hidden;">
          <tr><td style="height:4px;background:#efa188;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:28px 28px 8px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8b8b97;">CraftLink</p>
            <h1 style="margin:0;font-size:22px;line-height:1.35;font-weight:700;">Nouvelle demande #${escapeHtml(dossier)}</h1>
          </td></tr>
          <tr><td style="padding:12px 28px 0;font-size:16px;line-height:1.65;color:#4b5563;">
            <p style="margin:0 0 16px;">Bonjour${artisan.businessName ? ` ${escapeHtml(artisan.businessName)}` : ""},</p>
            <p style="margin:0 0 16px;">Un client vient de soumettre une demande sur votre page vitrine.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border-radius:14px;border:1px solid #f0f0f0;">
              <tr><td style="padding:16px 18px;font-size:14px;line-height:1.6;color:#212129;">
                <p style="margin:0 0 8px;"><strong>Nom :</strong> ${escapeHtml(lead.clientName)}</p>
                <p style="margin:0 0 8px;"><strong>Zone :</strong> ${escapeHtml(lead.zone || "—")}</p>
                <p style="margin:0 0 8px;"><strong>Urgence :</strong> ${escapeHtml(delayLabel(lead.delayStatus))}</p>
                <p style="margin:0 0 8px;"><strong>Travaux :</strong> ${escapeHtml(lead.workType || "—")}</p>
                <p style="margin:0;"><strong>Détail :</strong> ${escapeHtml(lead.description || "—")}</p>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:28px;" align="center">
            <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#efa188;color:#212129;font-size:15px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:999px;">
              Voir la demande dans mon Dashboard
            </a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = [
    `Nouvelle demande #${dossier}`,
    `Nom : ${lead.clientName}`,
    `Zone : ${lead.zone || "—"}`,
    `Urgence : ${delayLabel(lead.delayStatus)}`,
    `Travaux : ${lead.workType || "—"}`,
    `Détail : ${lead.description || "—"}`,
    "",
    `Voir la demande : ${ctaUrl}`,
  ].join("\n");

  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
