import { createClient } from "@/lib/supabase/client";

export const BANNERS_STORAGE_BUCKET = "banners";

function publicBannerUrl(storagePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BANNERS_STORAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadBannerImage(
  workspaceId: string,
  file: Blob,
  contentType = "image/webp",
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = createClient();
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("jpeg") || contentType.includes("jpg")
      ? "jpg"
      : "webp";
  const storagePath = `${workspaceId}/banners/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BANNERS_STORAGE_BUCKET)
    .upload(storagePath, file, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  return {
    storagePath,
    publicUrl: publicBannerUrl(storagePath),
  };
}
