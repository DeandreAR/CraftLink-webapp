import "server-only";

import type {
  RecommendedProduct,
  RecommendedProductInput,
} from "@/domain/recommendedProduct";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { VitrineRecommendedProduct } from "@/domain/vitrine";

function mapRow(row: Record<string, unknown>): RecommendedProduct {
  return {
    id: String(row.id),
    profile_id: String(row.profile_id),
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    brand: typeof row.brand === "string" ? row.brand : null,
    image_url: String(row.image_url ?? ""),
    affiliate_url: String(row.affiliate_url ?? ""),
    price_hint: typeof row.price_hint === "string" ? row.price_hint : null,
    position: Number(row.position ?? 0),
    is_active: row.is_active !== false,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export function toVitrineRecommendedProduct(
  product: RecommendedProduct,
): VitrineRecommendedProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    brand: product.brand,
    imageUrl: product.image_url,
    affiliateUrl: product.affiliate_url,
    priceHint: product.price_hint,
  };
}

export async function listOwnRecommendedProducts(
  profileId: string,
): Promise<RecommendedProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recommended_products")
    .select("*")
    .eq("profile_id", profileId)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function listPublicRecommendedProducts(
  profileId: string,
): Promise<VitrineRecommendedProduct[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("recommended_products")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data
    .map((row) => mapRow(row as Record<string, unknown>))
    .map(toVitrineRecommendedProduct);
}

export async function createRecommendedProduct(
  profileId: string,
  input: RecommendedProductInput,
): Promise<{ ok: true; product: RecommendedProduct } | { ok: false; error: string }> {
  const supabase = await createClient();

  const { data: maxRow } = await supabase
    .from("recommended_products")
    .select("position")
    .eq("profile_id", profileId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = Number(maxRow?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from("recommended_products")
    .insert({
      profile_id: profileId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      brand: input.brand?.trim() || null,
      image_url: input.image_url.trim(),
      affiliate_url: input.affiliate_url.trim(),
      price_hint: input.price_hint?.trim() || null,
      is_active: input.is_active !== false,
      position: nextPosition,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "create_failed" };
  }

  return { ok: true, product: mapRow(data as Record<string, unknown>) };
}

export async function updateRecommendedProduct(
  profileId: string,
  productId: string,
  input: Partial<RecommendedProductInput> & { position?: number },
): Promise<{ ok: true; product: RecommendedProduct } | { ok: false; error: string }> {
  const supabase = await createClient();

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.description !== undefined) patch.description = input.description?.trim() || null;
  if (input.brand !== undefined) patch.brand = input.brand?.trim() || null;
  if (input.image_url !== undefined) patch.image_url = input.image_url.trim();
  if (input.affiliate_url !== undefined) patch.affiliate_url = input.affiliate_url.trim();
  if (input.price_hint !== undefined) patch.price_hint = input.price_hint?.trim() || null;
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (input.position !== undefined) patch.position = input.position;

  const { data, error } = await supabase
    .from("recommended_products")
    .update(patch)
    .eq("id", productId)
    .eq("profile_id", profileId)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "update_failed" };
  }

  return { ok: true, product: mapRow(data as Record<string, unknown>) };
}

export async function deleteRecommendedProduct(
  profileId: string,
  productId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recommended_products")
    .delete()
    .eq("id", productId)
    .eq("profile_id", profileId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function reorderRecommendedProducts(
  profileId: string,
  orderedIds: string[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("recommended_products")
      .update({ position: index })
      .eq("id", id)
      .eq("profile_id", profileId),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  return { ok: true };
}
