"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdateDashboardProfileInput = {
  fullName: string;
  phone: string;
};

export type UpdateDashboardProfileResult =
  | { ok: true }
  | { ok: false; message: string };

export async function updateDashboardProfileAction(
  input: UpdateDashboardProfileInput,
): Promise<UpdateDashboardProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName.trim() || null,
      whatsapp_number: input.phone.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/[lang]/dashboard", "page");

  return { ok: true };
}
