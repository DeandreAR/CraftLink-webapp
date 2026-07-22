import { getAppHostname } from "@/config/app";

export type TrialEmailKind = "mid_trial" | "warning" | "expired";

export type TrialEmailTemplateInput = {
  recipientName: string | null;
  ctaUrl: string;
  leadsCount?: number;
  trialEndsAt?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function greeting(name: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? `Bonjour ${escapeHtml(trimmed)},` : "Bonjour,";
}

function formatTrialEndDate(iso: string | null | undefined): string {
  if (!iso) return "bientôt";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "bientôt";
  }
}

function trialEmailLayout(input: {
  preheader: string;
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote?: string;
}): string {
  const safeCta = escapeHtml(input.ctaUrl);
  const hostname = escapeHtml(getAppHostname());

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#212129;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f8f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;border:1px solid #ececec;overflow:hidden;">
            <tr>
              <td style="height:4px;background:#efa188;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8b8b97;">CraftLink</p>
                <h1 style="margin:0;font-size:22px;line-height:1.35;font-weight:700;color:#212129;">${escapeHtml(input.title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0;font-size:16px;line-height:1.65;color:#4b5563;">
                ${input.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;" align="center">
                <a href="${safeCta}" style="display:inline-block;background:#efa188;color:#212129;font-size:15px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:999px;">
                  ${escapeHtml(input.ctaLabel)}
                </a>
              </td>
            </tr>
            ${
              input.footerNote
                ? `<tr><td style="padding:8px 28px 28px;font-size:13px;line-height:1.55;color:#8b8b97;text-align:center;">${escapeHtml(input.footerNote)}</td></tr>`
                : `<tr><td style="padding:8px 28px 28px;font-size:13px;line-height:1.55;color:#8b8b97;text-align:center;">${hostname}</td></tr>`
            }
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function usageParagraph(leadsCount?: number): string {
  if (typeof leadsCount === "number" && leadsCount > 0) {
    return `<p style="margin:0 0 16px;">Vous avez déjà reçu <strong>${leadsCount} demande${leadsCount > 1 ? "s" : ""}</strong> via votre page CraftLink — continuez sur cette lancée.</p>`;
  }
  return `<p style="margin:0 0 16px;">Votre page vitrine est en ligne : partagez votre lien unique pour recevoir vos premières demandes qualifiées.</p>`;
}

export function renderTrialMidEmail(input: TrialEmailTemplateInput): string {
  return trialEmailLayout({
    preheader: "Milieu d'essai Pro — verrouillez l'offre Early Bird à 19 €/mois.",
    title: "Comment se passe votre première semaine ?",
    bodyHtml: `
      <p style="margin:0 0 16px;">${greeting(input.recipientName)}</p>
      ${usageParagraph(input.leadsCount)}
      <p style="margin:0 0 16px;">
        Pendant votre essai Pro, vous profitez déjà des <strong>Statistiques</strong>,
        du <strong>Calendrier terrain</strong> et de l'<strong>export CSV</strong> pour piloter votre activité.
      </p>
      <p style="margin:0 0 0;">
        Il vous reste encore quelques jours pour verrouiller le tarif <strong>Early Bird à 19&nbsp;€ HT/mois</strong>
        (au lieu de 29&nbsp;€) réservé aux pionniers CraftLink.
      </p>
    `,
    ctaLabel: "Voir mon espace & valider mon offre Pro",
    ctaUrl: input.ctaUrl,
    footerNote: "Sans engagement — vous pouvez vous abonner à tout moment pendant l'essai.",
  });
}

export function renderTrialWarningEmail(input: TrialEmailTemplateInput): string {
  const endLabel = formatTrialEndDate(input.trialEndsAt);
  return trialEmailLayout({
    preheader: "Plus que 2 jours pour garder l'accès Pro CraftLink.",
    title: "Plus que 2 jours sur votre essai Pro",
    bodyHtml: `
      <p style="margin:0 0 16px;">${greeting(input.recipientName)}</p>
      <p style="margin:0 0 16px;">
        Votre essai Pro se termine le <strong>${escapeHtml(endLabel)}</strong> (dans 2 jours).
      </p>
      <p style="margin:0 0 16px;">
        Après cette date, votre compte reste actif en <strong>plan Essentiel gratuit</strong>,
        mais le <strong>Calendrier</strong>, les <strong>Statistiques</strong> et l'<strong>export CSV</strong>
        seront verrouillés.
      </p>
      <p style="margin:0 0 0;">
        Activez maintenant le <strong>Plan Pro Early Bird à 19&nbsp;€ HT/mois</strong> pour conserver tous vos outils Pro.
      </p>
    `,
    ctaLabel: "Activer mon tarif Early Bird (19 €/mois)",
    ctaUrl: input.ctaUrl,
  });
}

export function renderTrialExpiredEmail(input: TrialEmailTemplateInput): string {
  return trialEmailLayout({
    preheader: "Votre essai Pro est terminé — repassez en Pro quand vous voulez.",
    title: "Votre essai Pro est terminé",
    bodyHtml: `
      <p style="margin:0 0 16px;">${greeting(input.recipientName)}</p>
      <p style="margin:0 0 16px;">
        Votre essai Pro CraftLink est arrivé à son terme. Bonne nouvelle : votre compte reste <strong>actif en mode Essentiel</strong>
        et les demandes de devis continuent d'arriver normalement sur votre page.
      </p>
      <p style="margin:0 0 0;">
        En revanche, le <strong>Calendrier</strong>, les <strong>Statistiques</strong> et l'<strong>export CSV</strong>
        sont suspendus. Réactivez le Plan Pro à tout moment pour retrouver vos outils de pilotage.
      </p>
    `,
    ctaLabel: "Débloquer le Plan Pro à 19 €/mois",
    ctaUrl: input.ctaUrl,
    footerNote: "Tarif Early Bird réservé aux 50 premiers artisans — 19 € HT/mois.",
  });
}

export const TRIAL_EMAIL_SUBJECTS: Record<TrialEmailKind, string> = {
  mid_trial: "Comment se passe votre première semaine sur CraftLink ? 🛠️",
  warning: "Plus que 2 jours pour profiter du Plan Pro CraftLink ⏳",
  expired: "Votre essai Pro CraftLink est terminé",
};

export function renderTrialEmailHtml(
  kind: TrialEmailKind,
  input: TrialEmailTemplateInput,
): string {
  switch (kind) {
    case "mid_trial":
      return renderTrialMidEmail(input);
    case "warning":
      return renderTrialWarningEmail(input);
    case "expired":
      return renderTrialExpiredEmail(input);
  }
}
