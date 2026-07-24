import "server-only";

import type {
  RecommendedItem,
  RecommendedItemInput,
} from "@/domain/recommendedProduct";
import { MAX_RECOMMENDED_ITEMS } from "@/domain/recommendedProduct";
import type { VitrineRecommendedProduct } from "@/domain/vitrine";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function mapRow(row: Record<string, unknown>): RecommendedItem {
  return {
    id: String(row.id),
    profile_id: String(row.profile_id),
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    discount_code: typeof row.discount_code === "string" ? row.discount_code : null,
    url: String(row.url ?? ""),
    image_url: typeof row.image_url === "string" ? row.image_url : null,
    position: Number(row.position ?? 0),
    is_active: row.is_active !== false,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export function toVitrineRecommendedItem(
  item: RecommendedItem,
): VitrineRecommendedProduct {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    brand: null,
    imageUrl: item.image_url,
    url: item.url,
    affiliateUrl: item.url,
    discountCode: item.discount_code,
    priceHint: item.discount_code,
  };
}

/** @deprecated Prefer toVitrineRecommendedItem */
export const toVitrineRecommendedProduct = toVitrineRecommendedItem;

export async function listOwnRecommendedItems(
  profileId: string,
): Promise<RecommendedItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recommended_items")
    .select("*")
    .eq("profile_id", profileId)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

/** @deprecated Prefer listOwnRecommendedItems */
export const listOwnRecommendedProducts = listOwnRecommendedItems;

export async function listPublicRecommendedItems(
  profileId: string,
): Promise<VitrineRecommendedProduct[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("recommended_items")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data
    .map((row) => mapRow(row as Record<string, unknown>))
    .map(toVitrineRecommendedItem);
}

/** @deprecated Prefer listPublicRecommendedItems */
export const listPublicRecommendedProducts = listPublicRecommendedItems;

export async function createRecommendedItem(
  profileId: string,
  input: RecommendedItemInput,
): Promise<{ ok: true; item: RecommendedItem } | { ok: false; error: string }> {
  const supabase = await createClient();

  const existing = await listOwnRecommendedItems(profileId);
  if (existing.length >= MAX_RECOMMENDED_ITEMS) {
    return { ok: false, error: "max_reached" };
  }

  const { data: maxRow } = await supabase
    .from("recommended_items")
    .select("position")
    .eq("profile_id", profileId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = Number(maxRow?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from("recommended_items")
    .insert({
      profile_id: profileId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      discount_code: input.discount_code?.trim() || null,
      url: input.url.trim(),
      image_url: input.image_url?.trim() || null,
      is_active: input.is_active !== false,
      position: nextPosition,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "create_failed" };
  }

  return { ok: true, item: mapRow(data as Record<string, unknown>) };
}

/** @deprecated Prefer createRecommendedItem */
export async function createRecommendedProduct(
  profileId: string,
  input: RecommendedItemInput & {
    brand?: string | null;
    image_url?: string;
    affiliate_url?: string;
    price_hint?: string | null;
  },
) {
  const result = await createRecommendedItem(profileId, {
    title: input.title,
    description: input.description ?? input.brand,
    discount_code: input.discount_code ?? input.price_hint,
    url: input.url || input.affiliate_url || "",
    image_url: input.image_url,
    is_active: input.is_active,
  });
  if (!result.ok) return result;
  return { ok: true as const, product: result.item };
}

export async function updateRecommendedItem(
  profileId: string,
  itemId: string,
  input: Partial<RecommendedItemInput> & { position?: number },
): Promise<{ ok: true; item: RecommendedItem } | { ok: false; error: string }> {
  const supabase = await createClient();

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.description !== undefined) patch.description = input.description?.trim() || null;
  if (input.discount_code !== undefined) {
    patch.discount_code = input.discount_code?.trim() || null;
  }
  if (input.url !== undefined) patch.url = input.url.trim();
  if (input.image_url !== undefined) patch.image_url = input.image_url?.trim() || null;
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (input.position !== undefined) patch.position = input.position;

  const { data, error } = await supabase
    .from("recommended_items")
    .update(patch)
    .eq("id", itemId)
    .eq("profile_id", profileId)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "update_failed" };
  }

  return { ok: true, item: mapRow(data as Record<string, unknown>) };
}

/** @deprecated Prefer updateRecommendedItem */
export async function updateRecommendedProduct(
  profileId: string,
  productId: string,
  input: Partial<RecommendedItemInput> & {
    position?: number;
    brand?: string | null;
    affiliate_url?: string;
    price_hint?: string | null;
  },
) {
  const result = await updateRecommendedItem(profileId, productId, {
    title: input.title,
    description: input.description,
    discount_code: input.discount_code ?? input.price_hint,
    url: input.url ?? input.affiliate_url,
    image_url: input.image_url,
    is_active: input.is_active,
    position: input.position,
  });
  if (!result.ok) return result;
  return { ok: true as const, product: result.item };
}

export async function deleteRecommendedItem(
  profileId: string,
  itemId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recommended_items")
    .delete()
    .eq("id", itemId)
    .eq("profile_id", profileId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** @deprecated Prefer deleteRecommendedItem */
export const deleteRecommendedProduct = deleteRecommendedItem;

export async function reorderRecommendedItems(
  profileId: string,
  orderedIds: string[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("recommended_items")
      .update({ position: index })
      .eq("id", id)
      .eq("profile_id", profileId),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  return { ok: true };
}

/** @deprecated Prefer reorderRecommendedItems */
export const reorderRecommendedProducts = reorderRecommendedItems;
