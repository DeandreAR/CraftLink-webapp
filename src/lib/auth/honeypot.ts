/** Champ leurre anti-bot — doit rester vide pour les humains. */
export const HONEYPOT_FIELD_NAME = "fax_number";

export function isHoneypotTriggered(value: FormDataEntryValue | null | undefined): boolean {
  return String(value ?? "").trim().length > 0;
}
