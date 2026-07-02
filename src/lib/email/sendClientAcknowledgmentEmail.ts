import { buildLeadShareUrl } from "@/lib/leads/buildLeadShareUrl";
import { getResendClient, RESEND_FROM_EMAIL } from "@/lib/email/resendClient";

export type ArtisanEmailProfile = {
  email: string;
  businessName: string;
};

export type ClientAcknowledgmentLead = {
  id: string;
  requestNumber: number;
  clientEmail: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatRequestNumber(requestNumber: number): string {
  return String(requestNumber).padStart(4, "0");
}

function buildClientAcknowledgmentEmailHtml(
  lead: ClientAcknowledgmentLead,
  artisanUser: ArtisanEmailProfile,
): string {
  const dossierNumber = formatRequestNumber(lead.requestNumber);
  const shareUrl = buildLeadShareUrl(lead.id);
  const artisanName = escapeHtml(artisanUser.businessName);

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Demande de travaux bien reçue</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:28px 24px 8px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">CraftLink</p>
                <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;color:#0f172a;">Demande bien reçue</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 0;font-size:16px;line-height:1.6;color:#334155;">
                <p style="margin:0 0 16px;">Bonjour,</p>
                <p style="margin:0 0 16px;">
                  Votre demande a bien été transmise à <strong>${artisanName}</strong>.
                  Un dossier a été ouvert sous le numéro <strong>#${dossierNumber}</strong>.
                </p>
                <p style="margin:0 0 24px;">
                  Vous pouvez suivre l'avancement de votre demande et retrouver les informations de l'artisan à tout moment en cliquant sur le bouton ci-dessous :
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 24px 28px;">
                <a href="${shareUrl}" style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;line-height:1;padding:14px 22px;border-radius:12px;">
                  Accéder à mon dossier de suivi
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;font-size:13px;line-height:1.5;color:#64748b;">
                <p style="margin:0;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
                <p style="margin:8px 0 0;word-break:break-all;"><a href="${shareUrl}" style="color:#0f172a;">${shareUrl}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Accusé de réception client après capture publique. */
export async function sendClientAcknowledgmentEmail(
  lead: ClientAcknowledgmentLead,
  artisanUser: ArtisanEmailProfile,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const clientEmail = lead.clientEmail.trim();
  if (!clientEmail) {
    return { ok: false, error: "E-mail client manquant." };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY manquante." };
  }

  const dossierNumber = formatRequestNumber(lead.requestNumber);
  const subject = `Demande de travaux bien reçue - Dossier #${dossierNumber}`;
  const html = buildClientAcknowledgmentEmailHtml(lead, artisanUser);

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: clientEmail,
      subject,
      html,
      ...(artisanUser.email.trim()
        ? { replyTo: artisanUser.email.trim() }
        : {}),
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Envoi e-mail impossible.";
    return { ok: false, error: message };
  }
}
