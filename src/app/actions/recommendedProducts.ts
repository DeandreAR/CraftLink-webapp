"use server";

import { revalidatePath } from "next/cache";
import type { RecommendedProductInput } from "@/domain/recommendedProduct";
import { createClient } from "@/lib/supabase/server";
import {
  createRecommendedProduct,
  deleteRecommendedProduct,
  listOwnRecommendedProducts,
  reorderRecommendedProducts,
  updateRecommendedProduct,
} from "@/lib/recommendedProducts/recommendedProductsService";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function listRecommendedProductsAction() {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, products: [], error: "auth" };
  const products = await listOwnRecommendedProducts(userId);
  return { ok: true as const, products };
}

export async function createRecommendedProductAction(input: RecommendedProductInput) {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, error: "auth" };
  if (!input.title.trim() || !input.image_url.trim() || !input.affiliate_url.trim()) {
    return { ok: false as const, error: "invalid" };
  }
  const result = await createRecommendedProduct(userId, input);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/partenaires");
  }
  return result;
}

export async function updateRecommendedProductAction(
  productId: string,
  input: Partial<RecommendedProductInput> & { position?: number },
) {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, error: "auth" };
  const result = await updateRecommendedProduct(userId, productId, input);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/partenaires");
  }
  return result;
}

export async function deleteRecommendedProductAction(productId: string) {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, error: "auth" };
  const result = await deleteRecommendedProduct(userId, productId);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/partenaires");
  }
  return result;
}

export async function reorderRecommendedProductsAction(orderedIds: string[]) {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, error: "auth" };
  const result = await reorderRecommendedProducts(userId, orderedIds);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/partenaires");
  }
  return result;
}
