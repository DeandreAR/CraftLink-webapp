import fs from "node:fs";
import path from "node:path";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

let cachedTemplate: string | null = null;

function loadTemplate(): string {
  if (cachedTemplate) return cachedTemplate;
  const templatePath = path.join(
    process.cwd(),
    "supabase/email-templates/reset-password.html",
  );
  cachedTemplate = stripHtmlComments(fs.readFileSync(templatePath, "utf8"));
  return cachedTemplate;
}

export function renderPasswordResetHtml(input: {
  email: string;
  confirmationUrl: string;
  siteUrl: string;
}): string {
  const safeEmail = escapeHtml(input.email);
  const safeUrl = escapeHtml(input.confirmationUrl);
  const safeSiteUrl = escapeHtml(input.siteUrl);

  return loadTemplate()
    .replaceAll("{{ .ConfirmationURL }}", safeUrl)
    .replaceAll("{{ .Email }}", safeEmail)
    .replaceAll("{{ .SiteURL }}", safeSiteUrl);
}
