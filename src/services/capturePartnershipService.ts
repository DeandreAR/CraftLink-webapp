import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PartnershipBudgetRange,
  PartnershipType,
  PublicPartnershipCaptureInput,
  PublicPartnershipCaptureResult,
} from "@/domain/partnershipRequest";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";

const PARTNERSHIP_TYPES = new Set<PartnershipType>([
  "advertising",
  "ugc",
  "product_test",
  "other",
]);

const BUDGET_RANGES = new Set<PartnershipBudgetRange>([
  "under_5k",
  "from_5k_to_15k",
  "from_15k_to_50k",
  "over_50k",
  "undisclosed",
]);

function validateInput(input: PublicPartnershipCaptureInput): string | null {
  const slug = sanitizePageSlugInput(input.pageSlug);
  if (!slug) return "Page artisan invalide.";

  if (!input.companyName.trim()) return "Nom d'entreprise requis.";
  if (!input.contactName.trim()) return "Nom du contact requis.";
  if (!input.jobTitle.trim()) return "Poste requis.";
  if (!input.email.trim()) return "E-mail requis.";
  if (!input.phone.trim()) return "Téléphone requis.";
  if (!input.message.trim()) return "Message requis.";
  if (!PARTNERSHIP_TYPES.has(input.partnershipType)) return "Type de partenariat invalide.";

  if (input.budgetRange && !BUDGET_RANGES.has(input.budgetRange)) {
    return "Fourchette de budget invalide.";
  }

  return null;
}

async function resolveWorkspaceByPageSlug(
  supabase: SupabaseClient,
  pageSlug: string,
): Promise<string | null> {
  const normalizedSlug = sanitizePageSlugInput(pageSlug);
  if (!normalizedSlug) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("page_slug", normalizedSlug)
    .maybeSingle();

  if (error || !data?.workspace_id) return null;
  return String(data.workspace_id);
}

export async function capturePublicPartnershipRequest(
  supabase: SupabaseClient,
  input: PublicPartnershipCaptureInput,
): Promise<PublicPartnershipCaptureResult> {
  const validationError = validateInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const workspaceId = await resolveWorkspaceByPageSlug(supabase, input.pageSlug);
  if (!workspaceId) {
    return { ok: false, message: "Artisan introuvable pour cette page." };
  }

  const { data, error } = await supabase
    .from("partnership_requests")
    .insert({
      workspace_id: workspaceId,
      company_name: input.companyName.trim(),
      contact_name: input.contactName.trim(),
      job_title: input.jobTitle.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      partnership_type: input.partnershipType,
      budget_range: input.budgetRange,
      budget_approximate: input.budgetApproximate?.trim() || null,
      message: input.message.trim(),
      workflow_status: "A_TRAITER",
    })
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data?.id) {
    return { ok: false, message: "Enregistrement de la demande impossible." };
  }

  return { ok: true, requestId: String(data.id) };
}
