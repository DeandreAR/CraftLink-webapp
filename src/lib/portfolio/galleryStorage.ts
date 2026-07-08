import { GALLERY_STORAGE_BUCKET } from "@/domain/portfolio";
import { createClient } from "@/lib/supabase/client";

function publicGalleryUrl(storagePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(GALLERY_STORAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadGalleryImage(
  workspaceId: string,
  file: Blob,
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = createClient();
  const storagePath = `${workspaceId}/gallery/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage
    .from(GALLERY_STORAGE_BUCKET)
    .upload(storagePath, file, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    storagePath,
    publicUrl: publicGalleryUrl(storagePath),
  };
}

export async function deleteGalleryStorageObject(storagePath: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(GALLERY_STORAGE_BUCKET).remove([storagePath]);
  if (error) {
    throw new Error(error.message);
  }
}
