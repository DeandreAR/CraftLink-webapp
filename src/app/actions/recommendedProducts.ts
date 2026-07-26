"use server";

import { revalidatePath } from "next/cache";
import type { RecommendedItemInput } from "@/domain/recommendedProduct";
import { MAX_RECOMMENDED_ITEMS } from "@/domain/recommendedProduct";
import { hasProFeatureAccess } from "@/lib/dashboard/planAccess";
import { createClient } from "@/lib/supabase/server";
import {
  createRecommendedItem,
  deleteRecommendedItem,
  listOwnRecommendedItems,
  reorderRecommendedItems,
  updateRecommendedItem,
} from "@/lib/recommendedProducts/recommendedProductsService";

async function requireProUser(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_tier, is_subscribed, trial_ends_at")
    .eq("id", user.id)
    .maybeSingle();

  const isPro = hasProFeatureAccess({
    plan_tier: profile?.plan_tier,
    is_subscribed: profile?.is_subscribed === true,
    trial_ends_at: profile?.trial_ends_at ?? null,
  });

  return isPro ? user.id : null;
}

function revalidatePartners() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/partenaires");
  revalidatePath("/[lang]/dashboard", "page");
}

export async function listRecommendedProductsAction() {
  const userId = await requireProUser();
  if (!userId) return { ok: false as const, products: [], error: "auth" };
  const products = await listOwnRecommendedItems(userId);
  return { ok: true as const, products };
}

export async function createRecommendedProductAction(input: RecommendedItemInput) {
  const userId = await requireProUser();
  if (!userId) return { ok: false as const, error: "auth" };
  if (!input.title.trim() || !input.url.trim()) {
    return { ok: false as const, error: "invalid" };
  }
  const result = await createRecommendedItem(userId, input, {
    maxItems: MAX_RECOMMENDED_ITEMS,
  });
  if (result.ok) {
    revalidatePartners();
    return { ok: true as const, product: result.item };
  }
  return result;
}

export async function updateRecommendedProductAction(
  productId: string,
  input: Partial<RecommendedItemInput> & { position?: number },
) {
  const userId = await requireProUser();
  if (!userId) return { ok: false as const, error: "auth" };
  const result = await updateRecommendedItem(userId, productId, input);
  if (result.ok) {
    revalidatePartners();
    return { ok: true as const, product: result.item };
  }
  return result;
}

export async function deleteRecommendedProductAction(productId: string) {
  const userId = await requireProUser();
  if (!userId) return { ok: false as const, error: "auth" };
  const result = await deleteRecommendedItem(userId, productId);
  if (result.ok) revalidatePartners();
  return result;
}

export async function reorderRecommendedProductsAction(orderedIds: string[]) {
  const userId = await requireProUser();
  if (!userId) return { ok: false as const, error: "auth" };
  const result = await reorderRecommendedItems(userId, orderedIds);
  if (result.ok) revalidatePartners();
  return result;
}
